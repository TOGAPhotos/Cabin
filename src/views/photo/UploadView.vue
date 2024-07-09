<script setup lang="ts">

import AirportSelect from "@/components/AirportSelect.vue";
import {reactive, ref} from "vue";
import {UploadFilled} from "@element-plus/icons-vue";
import type {UploadInstance, UploadProps, UploadRawFile,FormInstance,FormRules } from 'element-plus'
import {ElMessage, genFileId,} from "element-plus";
import AirlineSelect from "@/components/AirlineSelect.vue";

interface UploadInfo{
  register: string,
  msn:string,
  airportId: number | undefined,
  airlineId: number | undefined,
}

const copyrightFont = new FontFace('copyright_font', 'url(https://source.cdn.794td.cn/font/AlibabaPuHuiTi-3-55-Regular.woff2)');

const upload = ref<UploadInstance>();
let fileWaitForUpload:UploadRawFile;
let IMAGE = new Image()

const uploadForm = ref<FormInstance>();
const uploadInfo = reactive<UploadInfo>({
  register:'',
  msn:'',
  airportId: undefined,
  airlineId: undefined,
})
const uploadFormRules = reactive<FormRules<UploadInfo>>({
  register:[
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
  ]
})

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const checkFile: UploadProps['beforeUpload'] = async (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('格式错误');
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('图片大于4MB');
    return false;
  }

  const fileReader = new FileReader()
  fileReader.readAsDataURL(rawFile)
  await new Promise<void>(resolve => fileReader.onload = () => resolve());
  IMAGE.crossOrigin = 'anonymous';
  IMAGE.src = fileReader.result as string;
  await new Promise<void>(resolve => IMAGE.onload = () => resolve())
  let longSide = Math.max(IMAGE.width, IMAGE.height);
  if(longSide< 1279 || longSide > 1920){
    ElMessage.warning('尺寸超限')
    return false;
  }

  fileWaitForUpload = rawFile;
  return false;
}

async function preUpload(){
  if(!fileWaitForUpload){
    ElMessage.error('未选择文件');
    return;
  }

  if (!uploadForm.value){
    return
  }

  await uploadForm.value!.validate((isValid, invalidFields)=>{
    if(invalidFields){
      const firstField = Object.values(invalidFields)[0][0].field as string
      uploadForm.value?.scrollToField(firstField)
    }
  })


}

</script>

<template>
  <div id="upload-page">
    <div class="intro-box">
      <h4>TOGAPhotos</h4>
      <p>
        TOGAPhotos是一个由航空爱好者发起和维护的图库项目，我们诚挚的欢迎每一位新用户的到来，你们的支持是图库继续发展的最大动力。</p>
      <h4>补充信息</h4>
      <p>如果数据库中缺少您所需要的信息，请通过: <a>添加机场</a>，<a>添加航司/运营人</a>，<a>添加机型</a>进行补充。
      </p>

      <h4>有限的授权使用</h4>
      <p>TOGAPhotos <strong>可能在未事先通知您的情况下</strong>，将您上传的图片发布在TOGAPhotos的社交媒体账号上（遵循<a
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh-Hans">CC BY-NC-ND
        4.0协议</a>）。其余情况下TOGAPhotos将在事前与您取得联系。</p>
      <h4>我们不接受"云图"</h4>
      <p>TOGAPhotos只接受用户自己拍摄的图片，<strong>不接受任何形式的"云图"</strong>。</p>
    </div>
    <div id="upload-form">
      <el-form label-position="top" :model="uploadInfo" ref="uploadForm" :rules="uploadFormRules">

        <el-form-item>
          <el-upload
              style="width: 100%"
              drag
              ref="upload"
              :limit="1"
              :auto-upload="false"
              :before-upload="checkFile"
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
          <el-input v-model="uploadInfo.register"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 100%">自动填充</el-button>
        </el-form-item>

        <el-form-item label="制造商序列号" prop="msn">
          <el-input v-model="uploadInfo.msn"/>
        </el-form-item>

        <el-form-item label="航空公司/运营人" prop="airlineId">
          <AirlineSelect v-model="uploadInfo.airlineId"/>
        </el-form-item>

        <el-form-item label="机场" prop="airportId">
          <AirportSelect v-model="uploadInfo.airportId"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="preUpload">
            上传
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.intro-box h4 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
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
}
</style>