<script setup lang="ts">

import AirportSelect from "@/components/AirportSelect.vue";
import AirlineSelect from "@/components/AirlineSelect.vue";
import AirtypeSelect from "@/components/AirtypeSelect.vue";
import PhotoTypeSelect from "@/components/PhotoTypeSelect.vue";


import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";

import {
  type UploadInstance,
  type UploadProps,
  type UploadRawFile,
  type FormInstance,
  type FormRules,
  ElNotification
} from 'element-plus'
import {ElMessage, genFileId,} from "element-plus";
import {UploadFilled} from "@element-plus/icons-vue";

import { ExifReader, type ExifData } from "@/utils/exif";
import ServerRequest from "@/utils/request";
import useUserInfoStore from "@/stores/userInfo";
import type {AircraftInfo} from "@/utils/type/aircraft";
import CreateAirport from "@/components/CreateAirport.vue";
import CreateAirline from "@/components/CreateAirline.vue";
import CreateAirtype from "@/components/CreateAirtype.vue";


interface UploadFormInfo {
  reg: string,
  msn:string,
  airportId: number | undefined,
  airlineId: number | undefined,
  ac_type: string,
  photo_type: string[],
  remark: string,
  message:string,
  queue:string
}


let FILE:UploadRawFile;
const IMAGE = new Image()
const elemStatus = reactive({
  upload:false,
  reg:false,
  msn:false,
  airline:false,
  prioQueue:false,
  normQueueText:'',
  prioQueueText:'',
  showSelectPanel:'',
  uploading:false,
  airportPanel:false,
  airlinePanel:false,
  airtypePanel:false,
})
const localUserInfo = useUserInfoStore();
const route = useRoute();

onMounted(async ()=>{
  if(route.query.activate){
    console.log(route.query.activate);
  }
  const userInfoReq = new ServerRequest('GET',`/user/${localUserInfo.id}`);
  userInfoReq.success = () => {
    const u = userInfoReq.getData('userInfo');
    elemStatus.normQueueText = `普通队列（空余${u.free_queue}张）`;
    elemStatus.prioQueueText = `优先队列（空余${u.free_priority_queue}张）`;
    if(u.free_priority_queue === 0){
      elemStatus.prioQueue = true;
    }
    if(u.free_queue === 0){
      elemStatus.upload = true;
    }
  }
  await userInfoReq.send();
})

const fileUpload = ref<UploadInstance>();
const uploadFormInstance = ref<FormInstance>();
const uploadFormRules = reactive<FormRules<UploadFormInfo>>({
  reg:[
    {required: true, message: "请输入注册号/机身编号", trigger: "blur"},
  ],
  msn:[
    {required: true, message: "请输入制造商序列号", trigger: "blur"},
  ],
  airportId:[
    {required:true,message:'请选择机场',trigger:"blur"},
  ],
  airlineId:[
    {required:true,message:'请选择航司/运营人',trigger:"blur"},
    {type:"number",message:'请选择航司/运营人',trigger:"blur"},
  ],
  ac_type:[
    {required:true,message:'请选择机型',trigger:"blur"},
  ],
  message:[
    {max:100,message:'留言不能超过100字',trigger:"blur"}
  ],
})
const uploadFormInfo = reactive<UploadFormInfo>({
  reg:'',
  msn:'',
  airportId: undefined,
  airlineId: undefined,
  ac_type: "",
  photo_type:[],
  remark:"",
  message:"",
  queue:'NORM'
})
const uploadFormData = new FormData();

const handleExceed: UploadProps['onExceed'] = (files) => {
  fileUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  fileUpload.value!.handleStart(file)
}

async function CheckImage (rawFile:UploadRawFile){
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('格式错误');
    return Promise.reject();
  }
  if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('图片大于4MB');
    return Promise.reject();
  }

  const fileReader = new FileReader()
  fileReader.readAsDataURL(rawFile)
  await new Promise<void>(resolve => fileReader.onload = () => resolve());

  IMAGE.crossOrigin = 'anonymous';
  IMAGE.src = fileReader.result as string;
  await new Promise<void>(resolve => IMAGE.onload = () => resolve())
  const longSide = Math.max(IMAGE.width, IMAGE.height);
  if(longSide< 1279 || longSide > 1920){
    ElMessage.warning('尺寸超限')
    return Promise.reject()
  }

  FILE = rawFile;
  return Promise.reject()
}

const airportMode = (status:boolean):void =>{
  elemStatus.msn = status;
  elemStatus.airline = status;
  elemStatus.reg = status;
  if(status){
    uploadFormInfo.ac_type = "机场";
    uploadFormInfo.msn = "";
  }else{
    uploadFormInfo.reg = "";
    uploadFormInfo.ac_type = "";
  }


}

const getAirportIcaoCode = async (value:number)=>{
  if(!elemStatus.reg){
    return;
  }
  const airportInfoReq = new ServerRequest('GET', `/airport/${value}`);
  airportInfoReq.success = () =>{
    uploadFormInfo.reg = airportInfoReq.getData().icao_code;
  }
  await airportInfoReq.send();
}

async function PreUpload(){
  elemStatus.uploading = true;
  fileUpload.value!.submit();

  if(!FILE){
    uploadFormInstance.value!.scrollToField("file")
    ElMessage.error("图片未上传");
    return elemStatus.uploading = false;
  }
  const exif = await ExifReader(FILE)

  const validateResult = await uploadFormInstance.value!.validate(
    (isValid, invalidFields)=>{
      if(!invalidFields)return;
      const firstField = Object.values(invalidFields)[0][0].field as string
      uploadFormInstance.value?.scrollToField(firstField)
  })

  if(!validateResult){
    elemStatus.uploading = false;
    return;
  }

  uploadFormData.set("register",uploadFormInfo.reg)
  uploadFormData.set("msn",uploadFormInfo.msn)
  uploadFormData.set("airline_id",uploadFormInfo.airlineId!.toString())
  uploadFormData.set("airport_id",uploadFormInfo.airportId!.toString())
  uploadFormData.set("ac_type",uploadFormInfo.ac_type)
  uploadFormData.set("remark",uploadFormInfo.remark)
  uploadFormData.set("message",uploadFormInfo.message)
  uploadFormData.set("photo_type",uploadFormInfo.photo_type.join(","));
  uploadFormData.set("queue",uploadFormInfo.queue);
  uploadFormData.set("exif",JSON.stringify(exif));
  uploadFormData.set("file",FILE);
}

function AutoFillSelect(aircraft:AircraftInfo){
  uploadFormInfo.reg = aircraft.reg;
  uploadFormInfo.msn = aircraft.msn;
  uploadFormInfo.airlineId = aircraft.airlineId;
  uploadFormInfo.ac_type = aircraft.air_type;

}

async function AutoFill(){
  if(uploadFormInfo.reg === ""){
    return ElNotification.warning({
      title:"注册号不能为空",
      message:"使用自动填充时注册号不能为空"
    })
  }
  const infoReq = new ServerRequest("GET",`/aircraft?reg=${uploadFormInfo.reg}`);
  infoReq.success = () =>{
    const aircraft = infoReq.getData();
    if(aircraft.length === 0){
      return ElNotification.warning({
        title:"未找到相关信息",
        message:"请手动填写"
      })
    }
    AutoFillSelect(aircraft[0]);
  }
  await infoReq.send()
}
</script>

<template>
  <div id="upload-page">
    <div class="intro-box">
      <h4>TOGAPhotos</h4>
      <p>
        TOGAPhotos是一个由航空爱好者发起和维护的图库项目，我们诚挚的欢迎每一位新用户的到来，你们的支持是图库继续发展的最大动力。</p>
      <h4>补充信息</h4>
      <p>如果数据库中缺少您所需要的信息，请通过:
        <a @click="elemStatus.airportPanel=true">添加机场</a>，
        <a @click="elemStatus.airlinePanel = true">添加航司/运营人</a>，
        <a @click="elemStatus.airtypePanel = true">添加机型</a>
        进行补充。
      </p>

      <h4>有限的授权使用</h4>
      <p>TOGAPhotos <strong>可能在未事先通知您的情况下</strong>，将您上传的图片发布在TOGAPhotos的社交媒体账号上（遵循<a
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-Hans">CC BY-NC-ND
        4.0协议</a>）。其余情况下TOGAPhotos将在事前与您取得联系。</p>
      <h4>我们不接受"云图"</h4>
      <p>TOGAPhotos只接受用户自己拍摄的图片，<strong>不接受任何形式的"云图"</strong>。</p>
    </div>
    <div id="upload-form">
      <el-form
          v-loading="elemStatus.uploading"
          label-position="top"
          :model="uploadFormInfo"
          ref="uploadFormInstance"
          :rules="uploadFormRules"
      >

        <el-form-item prop="file">
          <el-upload
              style="width: 100%"
              drag
              ref="fileUpload"
              :limit="1"
              :auto-upload="false"
              :before-upload="CheckImage"
              list-type="picture"
              :on-exceed="handleExceed"
          >
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              将文件拖拽到此处或<em>点此上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只接受JPEG文件，文件不大于4MB。
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="注册号/机身编号" prop="register">
          <el-input
              v-model="uploadFormInfo.reg"
              :disabled="elemStatus.reg"
          />
          <div class="remark">如果无注册号，请使用NO-REG</div>
          <el-button type="primary" style="width: 100%" @click="AutoFill">自动填充</el-button>
        </el-form-item>

        <el-form-item label="制造商序列号" prop="msn">
          <el-input
              v-model="uploadFormInfo.msn"
              :disabled="elemStatus.msn"
          />
<!--          <a @click="uploadFormInfo.msn='UNKNOWN MSN'">不知道MSN</a>-->
        </el-form-item>

        <el-form-item label="机型" prop="ac_type">
          <AirtypeSelect v-model="uploadFormInfo.ac_type"/>
        </el-form-item>

        <el-form-item label="航空公司/运营人" prop="airlineId">
          <AirlineSelect
              v-model="uploadFormInfo.airlineId"
          />
        </el-form-item>

        <el-form-item label="拍摄位置" prop="airportId">
          <AirportSelect
              @change=" (v:number) => getAirportIcaoCode(v)"
              v-model="uploadFormInfo.airportId"
          />
        </el-form-item>

        <el-form-item label="图片分类" >
          <PhotoTypeSelect
              v-model="uploadFormInfo.photo_type"
              @airportMode="s => airportMode(s)"
          />
        </el-form-item>

        <el-form-item label="图片备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="uploadFormInfo.remark"/>
        </el-form-item>

        <el-form-item label="给审图员的留言" prop="message">
          <el-input type="textarea" :rows="2" v-model="uploadFormInfo.message"/>
        </el-form-item>

        <el-form-item label="队列选择">
          <el-select v-model="uploadFormInfo.queue">
            <el-option
                :label="elemStatus.normQueueText" value="NORM"
            />
            <el-option
                :label="elemStatus.prioQueueText" value="PRIO"
                :disabled="elemStatus.prioQueue"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="PreUpload" :disabled="elemStatus.upload">
            上传
          </el-button>
        </el-form-item>

      </el-form>
    </div>
    <CreateAirport v-model="elemStatus.airportPanel"/>
    <CreateAirline v-model="elemStatus.airlinePanel"/>
    <CreateAirtype v-model="elemStatus.airtypePanel"/>
  </div>
</template>

<style scoped>
.intro-box h4 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
}
.remark{
  font-size: 0.8rem;
}
.intro-box p {
  font-size: 15px;
  text-indent: 2em;
  margin-bottom: 1em;
}

#upload-page {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

#upload-form {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 25px 25px;
  max-width: 375px !important;
}

@media only screen and (min-width: 701px) {
  .intro-box {
    width: 40%;
    max-width: 35rem;
  }

  #upload-form {
    max-width: 500px;
    width: 55%;
    min-width: 300px;
  }
}

@media only screen and (max-width: 701px) {
  #upload-form {
    width: 100%;
  }
  .intro-box *{
    font-size: 0.9rem!important;
  }
}

</style>