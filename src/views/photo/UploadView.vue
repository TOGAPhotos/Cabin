<script setup lang="ts">

// import AirportSelect from "@/components/selector/AirportSelect.vue";
// import AirlineSelect from "@/components/selector/AirlineSelect.vue";
// import AirtypeSelect from "@/components/selector/AirtypeSelect.vue";
import AircraftTypeSelect from "@/components/selector/AircraftTypeSelect.vue";
import AirportSelect from "@/components/selector/AirportSelect.vue";
import AirlineSelect from "@/components/selector/AirlineSelect.vue";
import PhotoTypeSelect from "@/components/PhotoTypeSelect.vue";

import {reactive, ref, watch} from "vue";
import {useRoute} from "vue-router";

import type {
   UploadInstance,
   UploadProps,
   UploadRawFile,
   FormInstance,
   FormRules,
} from 'element-plus'
import {ElNotification, ElMessage, genFileId, ElLoading,} from "element-plus";
import {UploadFilled} from "@element-plus/icons-vue";

import { ExifReader } from "@/utils/exif";
import ServerRequest from "@/utils/request";
import useUserInfoStore from "@/stores/userInfo";
import type {AircraftInfo} from "@/utils/type/aircraft";
import CreateAirport from "@/components/CreateAirport.vue";
import CreateAirline from "@/components/CreateAirline.vue";
import CreateAirtype from "@/components/CreateAirtype.vue";
import { getAirportById } from "@/utils/info";
import { checkImage } from "@/utils/check-image";
import CosStrorage from "@/utils/cos";

interface UploadFormInfo {
  reg: string,
  msn:string,
  airportId: number | undefined,
  airlineId: number | undefined,
  ac_type: string,
  photoType: string[],
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
  airtype:false,
  prioQueue:false,
  normQueueText:'',
  prioQueueText:'',
  showSelectPanel:'',
  airportPanel:false,
  airlinePanel:false,
  airtypePanel:false,
})
const localUserInfo = useUserInfoStore();
const route = useRoute();

const init = async ()=>{
  const userInfoReq = new ServerRequest('GET',`/user/${localUserInfo.id}`);
  userInfoReq.success = () => {
    const u = userInfoReq.getData('userInfo');
    elemStatus.normQueueText = `普通队列（空余${u.free_queue}张）`;
    elemStatus.prioQueueText = `优先队列（空余${u.free_priority_queue}张）`;
    if(u.free_priority_queue <= 0){
      elemStatus.prioQueue = true;
    }
    if(u.free_queue <= 0){
      elemStatus.upload = true;
    }
  }
  await userInfoReq.send();
}
(async () => await init())();

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
  photoType:[],
  remark:"",
  message:"",
  queue:'NORM'
})

const handleExceed: UploadProps['onExceed'] = (files) => {
  fileUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  fileUpload.value!.handleStart(file)
}


const beforeUpload = (rawFile:UploadRawFile) => {
  FILE = rawFile;
  return false;
  

}



watch(()=>uploadFormInfo.photoType,async (newValue:string[])=>{
  let status = newValue.join("").includes("A") 
  elemStatus.msn = status;
  elemStatus.airtype = status;
  elemStatus.airline = status;
  elemStatus.reg = status;
  if(status){
    uploadFormInfo.ac_type = "机场";
    uploadFormInfo.msn = "";
    if(uploadFormInfo.airportId){
      const { icao_code } = await getAirportById(uploadFormInfo.airportId)
      uploadFormInfo.reg = icao_code;
    }
  }else{
    uploadFormInfo.reg = "";
    uploadFormInfo.ac_type = "";
  }
})

watch(()=>uploadFormInfo.airportId, async (newValue:number|undefined)=>{
  if(!newValue) return;
  if(!elemStatus.reg) return;
  const { icao_code } = await getAirportById(newValue)
  uploadFormInfo.reg = icao_code;
})

async function PreUpload(){
  let uploading = ElLoading.service({
    text:'正在创建图片',
    target:'#upload-form',
  })
  
  const validateResult = await uploadFormInstance.value!.validate(
    (isValid, invalidFields)=>{
      if(isValid)return;
      const firstField = Object.values(invalidFields!)[0][0].field as string
      uploadFormInstance.value?.scrollToField(firstField)
    })
    
  if(!validateResult){
    uploading.close();
    return;
  }
    
  fileUpload.value!.submit();
  if(!FILE){
    uploadFormInstance.value!.scrollToField("file")
    ElMessage.error("图片未上传");
    return uploading.close();
  }

  if( !(await checkImage(FILE)) ) return;
  // const exif = ExifReader(FILE)

  const uploadData = {
    reg:uploadFormInfo.reg,
    msn:uploadFormInfo.msn,
    airline:uploadFormInfo.airlineId,
    airport:uploadFormInfo.airportId,
    ac_type:uploadFormInfo.ac_type,
    remark:uploadFormInfo.remark,
    message:uploadFormInfo.message,
    picType:uploadFormInfo.photoType.join(','),
    queue:uploadFormInfo.queue
  }
  const uploadReq = new ServerRequest('POST','/photo',uploadData);
  uploadReq.success = () => {
    uploading.close();
  }
  let uploadError = false;
  uploadReq.error = (_,msg) => {
    ElNotification.error({
      title:"创建失败",
      message:msg
    })
    uploadError = true;
  }
  await uploadReq.send()

  if(uploadError){
    fileUpload.value!.clearFiles();
    uploadFormInstance.value!.resetFields();
    uploading.close();
    return;
  }

  uploading = ElLoading.service({
    text:'正在上传图片',
    target:'#upload-form',
  })
  const {uploadUrl, photoId} = uploadReq.getData()

  try{
    const buffer = await FILE.arrayBuffer();
    await CosStrorage.uploadFile(uploadUrl,buffer);
    ElNotification.success({title:"上传成功"})
  }catch(e){
    ElNotification.error({
      title:"上传失败",
    })
  }finally{
    fileUpload.value!.clearFiles();
    uploadFormInstance.value!.resetFields();
    uploading.close();
    await init();
  }

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
      <div>如果数据库中缺少您所需要的信息，请通过:
        <ul>
          <li><a @click="elemStatus.airportPanel=true">添加机场</a></li>
          <li><a @click="elemStatus.airlinePanel=true">添加航司/运营人</a></li>
          <li><a @click="elemStatus.airtypePanel=true">添加机型</a></li>
        </ul>
        进行补充。
      </div>
      <p></p>
      <!-- Empty Tag for style   -->
      <h4>有限的授权使用</h4>
      <p>TOGAPhotos <strong>可能在未事先通知您的情况下</strong>，将您上传的图片发布在TOGAPhotos的社交媒体账号上（遵循<a
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-Hans">CC BY-NC-ND
        4.0协议</a>）。其余情况下TOGAPhotos将在事前与您取得联系。</p>
      <h4>我们不接受"云图"</h4>
      <p>TOGAPhotos只接受用户自己拍摄的图片，<strong>不接受任何形式的"云图"</strong>。</p>
    </div>
    <div id="upload-form">
      <el-form
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
              :before-upload="beforeUpload"
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
          <AircraftTypeSelect 
            v-model="uploadFormInfo.ac_type"
            :disabled="elemStatus.airtype"
          />
        </el-form-item>

        <el-form-item label="航空公司/运营人" prop="airlineId">
          <AirlineSelect
              v-model="uploadFormInfo.airlineId"
          />
        </el-form-item>

        <el-form-item label="拍摄位置" prop="airportId">
          <AirportSelect
              v-model="uploadFormInfo.airportId"
          />
        </el-form-item>

        <el-form-item label="图片分类" >
          <PhotoTypeSelect
              v-model="uploadFormInfo.photoType"
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