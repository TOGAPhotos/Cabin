<script setup lang="ts">

import AirportSelect from "@/components/selector/AirportSelect.vue";
import {reactive, ref} from "vue";
import type {UploadInstance, UploadProps, UploadRawFile,FormInstance,FormRules } from 'element-plus'
import {ElMessage, genFileId,} from "element-plus";
import AirlineSelect from "@/components/selector/AirlineSelect.vue";
import AircraftTypeSelect from "@/components/selector/AircraftTypeSelect.vue";
import type { ExifData } from '@/utils/exif'
import { ExifReader } from '@/utils/exif'
import {UploadFilled, CameraFilled, Finished, Timer} from "@element-plus/icons-vue";

type UploadInfo = {
  register: string,
  msn:string,
  aircraftType: number | undefined,
  airportId: number | undefined,
  airlineId: number | undefined,
  specialTypeList: string[],
  photoDate: Date | undefined,
  remark: string,
  leaveMessage: string,
  queueId: number | undefined,
  exif: ExifData | undefined,
  socialMediaAuth: boolean
}

const copyrightFont = new FontFace('copyright_font', 'url(https://source.cdn.794td.cn/font/AlibabaPuHuiTi-3-55-Regular.woff2)');

const upload = ref<UploadInstance>();
let fileWaitForUpload:UploadRawFile;
let IMAGE = new Image()
let fileList = ref<UploadRawFile[]>([]);
let exif : ExifData
const freeStanderQueueSlots = ref<number>(5);
const freePriortyQueueSlots = ref<number>(0);
const showExifAuth = ref<boolean>(true);

const uploadForm = ref<FormInstance>();
const uploadInfo = reactive<UploadInfo>({
  register:'',
  msn:'',
  aircraftType: undefined,
  airportId: undefined,
  airlineId: undefined,
  specialTypeList: [],
  photoDate: undefined,
  remark: '',
  leaveMessage: '',
  queueId: 0,
  exif: undefined,
  socialMediaAuth: true
})
const uploadFormRules = reactive<FormRules<UploadInfo>>({
  register:[
    {required: true, message: "请输入注册号/机身编号", trigger: "blur"},
  ],
  msn:[
    {required: true, message: "请输入制造商序列号", trigger: "blur"},
  ],
  aircraftType: [
    {required: true, message: '请选择机型', trigger: "blur"}
  ],
  airportId:[
    {required:true,message:'请选择机场',trigger:"blur"},
  ],
  airlineId:[
    {required:true,message:'请选择航司/运营人',trigger:"blur"},
    {type:"number",message:'请选择航司/运营人',trigger:"blur"},
  ],
  photoDate:[
    {required: true, message: '请选择拍摄日期', trigger: "blur"}
  ],
  queueId:[
    {required: true, message: '请选择上传队列', trigger: "blur"}
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
  } else if (rawFile.size / 1024 / 1024 > 4) {
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

function handleChange(file: any, fileList: any[]){
  ExifReader(file.raw).then((exifInfo:ExifData)=>{
    if (exifInfo && Object.keys(exifInfo).length > 0) {
      exif = exifInfo
      console.log(exif)
      uploadInfo.photoDate = exif.DateOriginal
    } else {
      console.log('No EXIF data found for this image.');
    }
  }).catch((error) => {
    console.error('Error reading EXIF data:', error);
  })
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

async function preUpload(){
  uploadInfo.exif = showExifAuth.value ? exif : undefined
  console.log(uploadInfo)
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
  <div id="upload-page" class="content-box">
    <div id="upload-form">
      <el-form 
        label-position="top" 
        :model="uploadInfo" 
        ref="uploadForm" 
        :rules="uploadFormRules"
      >
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
              :file-list="fileList"
              :on-change="handleChange"
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
          <el-button type="primary" style="width: 100%" color="#001A38">自动填充</el-button>
        </el-form-item>

        <el-form-item label="制造商序列号" prop="msn">
          <el-input v-model="uploadInfo.msn"/>
        </el-form-item>

        <el-form-item label="机型" prop="aircraftType">
          <AircraftTypeSelect v-model="uploadInfo.aircraftType"/>
        </el-form-item>

        <el-form-item label="航空公司/运营方" prop="airlineId">
          <AirlineSelect v-model="uploadInfo.airlineId"/>
        </el-form-item>

        <el-form-item label="拍摄地点" prop="airportId">
          <AirportSelect v-model="uploadInfo.airportId"/>
        </el-form-item>

        <el-form-item label="特殊选项">
          <el-checkbox-group v-model="uploadInfo.specialTypeList" text-color="#001A38" class="special-selector">
            <el-checkbox label="机场" value="airport"/>
            <el-checkbox label="特殊涂装" value="specialLivery"/>
            <el-checkbox label="驾驶舱/客舱" value="cockpitOrCabin"/>
            <el-checkbox label="火箭/航天器" value="spacecraft"/>
            <el-checkbox label="博物馆" value="museum"/>
            <el-checkbox label="非固定翼航空器" value="helicopter"/>
            <el-checkbox label="军用飞机" value="military"/>
            <el-checkbox label="滑翔机" value="glider"/>
            <el-checkbox label="事故" value="accident"/>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="拍摄日期" prop="photoDate">
          <el-date-picker
            v-model="uploadInfo.photoDate"
            type="date"
            placeholder="请选择拍摄日期"
            :disabled-date="disabledDate"
          />
        </el-form-item>

        <el-form-item label="图片备注" prop="remark">
          <el-input
            v-model="uploadInfo.remark"
            style="width: 100%"
            :rows="2"
            type="textarea"
            placeholder="图片备注"
          />
        </el-form-item>

        <el-form-item label="留言" prop="leaveMessage">
          <el-input
            v-model="uploadInfo.leaveMessage"
            style="width: 100%"
            :rows="2"
            type="textarea"
            placeholder="仅审图员可见"
          />
        </el-form-item>

        <el-form-item label="队列选择" prop="queueId">
          <el-select
            v-model="uploadInfo.queueId"
            placeholder="Select"
            style="width: 100%"
          >
            <el-option
              :label="`普通队列（剩余${freeStanderQueueSlots}张）`"
              :value="0"
              :disabled="!freeStanderQueueSlots"
            />
            <el-option
              :label="`优先队列（剩余${freePriortyQueueSlots}张）`"
              :value="1"
              :disabled="!freePriortyQueueSlots"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="授权" prop="socialMediaAuth">
          <el-checkbox 
            v-model="showExifAuth"
            label="展示图片的Exif信息"
          />
          <el-checkbox 
            v-model="uploadInfo.socialMediaAuth"
            label="TOGAPhotos 社交媒体使用授权"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="preUpload">
            上传
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="intro-box">
      <ul class="data-box">
        <li class="data-card">
          <div class="icon">
            <CameraFilled />
          </div>
          <div class="content">
            <h5>当前队列长度</h5>
            <div class="data">100</div>
          </div>
        </li>
        <li class="data-card">
          <div class="icon">
            <Finished />
          </div>
          <div class="content">
            <h5>平均通过率<span class="remark">（近30天）</span></h5>
            <div class="data">65.5<span class="unit">%</span></div>
          </div>
        </li>
        <li class="data-card">
          <div class="icon">
            <Timer />
          </div>
          <div class="content">
            <h5>平均审核时间<span class="remark">（近1000张）</span></h5>
            <div class="data">10<span class="unit"> 天 </span>12<span class="unit"> 小时 </span></div>
          </div>
        </li>
      </ul>
      <h4>TOGAPhotos</h4>
      <p>
        TOGAPhotos是一个由航空爱好者发起和维护的图库项目，我们诚挚的欢迎每一位新用户的到来，你们的支持是图库继续发展的最大动力。
      </p>
      <h4>上传规格</h4>
      <p>
        图片格式需为JPG/JPEG，图片长边不小于1280px,不大于1920px。<em>目前无图片比例限制。</em>
      </p>
      <h4>上传标准</h4>
      <p>
        用户上传的图片在经过TOGAPhotos图片审核团队的审核之后才会进入图库。<a href="https://guide.togaphotos.com/">详细审核标准</a>
      </p>
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

.intro-box .data-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  width: 100%;
  /* height: 200px; */
  /* background-color: green; */
}

.intro-box .data-box .data-card {
  padding: 1rem 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 32%;
  height: 5rem;
  border-radius: 6px;
  transition: transform 0.3s ease;
  box-shadow: 0.075rem 0.15rem 0.3rem rgba(0, 0, 0, 0.1);
  background-color: white;
}

.data-card:hover {
  box-shadow: 0.3rem 0.6rem 1.2rem rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transform: translateY(-0.15rem);
}

.data-card .icon {
  width: 2rem;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-right: 0.8rem;
  /* background-color: white; */
}

.data-card .content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* background-color: white; */
}

.content h5 {
  font-size: 1rem;
  font-weight: 700;
}

.content h5 .remark {
  font-size: 0.82rem;
  font-weight: 500;
}

.content .data {
  font-size: 1.5rem;
  font-weight: 500;
  text-align: left;
}

.content .data .unit {
  font-size: 1.1rem;
  font-weight: 400;
}

#upload-page {
  margin-top: 2.3rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 2rem;
}

#upload-form {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 25px 25px;
  max-width: 425px !important;
}

.special-selector{
  /* background-color: red; */
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 5px;
}
.special-selector .el-checkbox{
  margin: 0;
  width: 120px;
}

:deep(.el-date-editor){
  width: 100%;
}

:deep(.el-checkbox__label) {
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.3;
}

@media only screen and (min-width: 701px) {
  .intro-box {
    /* width: 40%; */
    width: 100%;
    max-width: 50rem;
  }

  #upload-form {
    /* max-width: 500px;
    width: 55%;
    min-width: 300px; */
    /* min-width: 300px; */
    width: 40%;
    /* max-width: 50rem; */
  }
}

@media only screen and (max-width: 701px) {
  #upload-form {
    width: 100%;
  }
}
</style>