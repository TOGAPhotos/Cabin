<script setup lang="ts">
import {computed, watch, ref, useTemplateRef} from "vue";
import {useRoute} from "vue-router";
import {Checked, User} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

import router from "@/router";

import ImgLoader from "@/components/ImgLoader.vue";
import InfoLabel from "@/components/InfoLabel.vue";
import ContactPanel from "@/component/ContactPanel.vue";
import Thumbnail from "@/components/Thumbnail.vue";

import type {AcceptPhoto, PhotoSearchType} from "@/utils/type/photo";
import ServerRequest from "@/utils/request";
import {RemoteSearch} from "@/utils/remoteSearch";
import Device from "@/utils/device";
import { PhotoUrl } from "@/utils/photo-url";

import useUserInfoStore from "@/stores/userInfo";

const airportText = ref("")
const showContactPanel = ref(false);
const route = useRoute();
const photoId = <string>route.params.id;
const photoInfo = ref<AcceptPhoto>()
const relatedPhotoList = ref<AcceptPhoto[]>([]);
const imgBoxElm = useTemplateRef('_imgBox');
const showEditOption = computed(()=>{
  const user = useUserInfoStore();
  return user.permission === 'ADMIN' || user.id === photoInfo.value?.upload_user_id;
})
async function SearchRelatedPhoto(){
  const searchGroup = await Promise.all([
      RemoteSearch.photo('reg',<string>photoInfo.value?.ac_reg,-1,5),
      RemoteSearch.photo('airport',<string>photoInfo.value?.airport_icao_code,-1,5),
      RemoteSearch.photo('user',<string>photoInfo.value?.username,-1,5),
  ]);
  const resultArray = searchGroup.reduce((list, item) => list.concat(item))
  for(const item of resultArray){
    if(item.id === Number(photoId)){
      continue;
    }
    if(relatedPhotoList.value.find(value => value.id === item.id)){
      continue;
    }
    relatedPhotoList.value.push(item);
  }
  
  const listLen = relatedPhotoList.value.length;
  if (Device.isPhone() && listLen > 2) {
    relatedPhotoList.value = relatedPhotoList.value.slice(0, listLen - ( listLen % 2 ));
  }else if (listLen > 4){
    relatedPhotoList.value = relatedPhotoList.value.slice(0, listLen - ( listLen % 4 ));
  }
}
const setImgBoxPositon = () => {
  imgBoxElm.value!.style.transform = `translateX(-${imgBoxElm.value!.offsetLeft}px)`;
}


(async () => {
  const photoInfoReq = new ServerRequest('GET', `/photo/${photoId}`);
  photoInfoReq.success = () => photoInfo.value = photoInfoReq.getData() as AcceptPhoto;
  photoInfoReq.error = () => router.push('/')
  await photoInfoReq.send();

  if(photoInfo.value?.photo_time){
    photoInfo.value.photo_time = photoInfo.value.photo_time.split('T')[0]
  }
  airportText.value = photoInfo.value?.airport_icao_code as string;
  if(photoInfo.value?.airport_iata_code){
    airportText.value = photoInfo.value.airport_iata_code + "/" + airportText.value
  }
  airportText.value += `<br>${photoInfo.value?.airport_cn}`
  await SearchRelatedPhoto();
  if(!Device.isPhone()){
    setImgBoxPositon();
    window.addEventListener('resize',setImgBoxPositon);
  }
})()

const searchLink = (type:PhotoSearchType,content:string|undefined) => content ? `/search?type=${type}&content=${content}` : " ";

const deletePhoto = async () => {
  try{
    await ElMessageBox.prompt(
      `请确认删除图片ID:${photoInfo.value?.id}`,
      `删除图片`,
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        inputErrorMessage: 'ID输入错误',
        type: 'warning',
        inputValidator: v =>  v === photoInfo.value?.id.toString()
      }
    )
  }catch{
    return ElMessage.info('取消删除');
  }
  const req = new ServerRequest('DELETE', `/photo/${photoId}`);
  req.success = () => {
    ElMessage.success('删除成功');
    return router.push('/')
  }
  req.error = (_,msg) => ElMessage.error(msg);
  await req.send();
}

</script>

<template>
  <div id="photo-view">
    <div class="image-box" ref="_imgBox">
      <ImgLoader :src="PhotoUrl(photoId)" :alt="photoInfo?.ac_reg" 
        :protect="true"
      />
    </div>
    <div class="info-box">
      <div class="info-area">
        <div class="label-group">
          <InfoLabel
              label="注册号" :value="photoInfo?.ac_reg"
              :link="searchLink('reg',photoInfo?.ac_reg)"
          />
          <InfoLabel label="序列号" :value="photoInfo?.ac_msn" />
          <InfoLabel
              label="机型" :value="photoInfo?.ac_type"
              :link="searchLink('airtype',photoInfo?.ac_type)"
          />
        </div>
        <div class="label-group">
          <InfoLabel
              label="航空公司/运营人" :value="photoInfo?.airline_cn"
          />
          <InfoLabel
              label="机场" :value="airportText"
              :link="searchLink('airport',photoInfo?.airport_icao_code)"
          />
          <!-- <InfoLabel label="机场" :value="photoInfo?.airport_cn"/> -->
        </div>
        <div class="label-group user-info">
          <InfoLabel
              label="摄影师" :value="photoInfo?.username"
              :link="'/user/'+photoInfo?.upload_user_id"
              class="username"
          />
          <InfoLabel label="摄影师备注" :value="photoInfo?.user_remark"/>
        </div>
      </div>
      <div class="action-area">
        <div>
          <el-button type="primary" disabled>
            <el-icon><Checked /></el-icon>
            为这张图片投票
          </el-button>
        </div>
        <div>
          <el-button type="primary" @click="showContactPanel=true" v-if="!showEditOption">
            <el-icon><User /></el-icon>
            联系摄影师
          </el-button>
        </div>
        <!-- <div style="height: 1px;background-color: black;"></div> -->
        <div v-if="showEditOption">
          <el-button type="primary" @click="router.push('/photo/'+photoInfo?.id+'/edit')" disabled>
            编辑图片信息
          </el-button>
        </div>
        <div v-if="showEditOption">
          <el-button type="danger" @click="deletePhoto">
            删除图片
          </el-button>
        </div>
      </div>
    </div>
    <el-divider/>
    <div class="related-photo-area">
      <Thumbnail
        v-for="photo in relatedPhotoList"
        :id="photo.id"
        :reg="photo.ac_reg"
        :airline="photo.airline_cn"
        :username="photo.username"
        :air-type="photo.ac_type"
      />
    </div>
    <ContactPanel v-model="showContactPanel" v-bind:photoInfo="photoInfo as AcceptPhoto" />
  </div>
</template>

<style scoped>
#photo-view {
  width: 100% !important;
  margin: 0 calc(100% - 100vw) 0 0;
  max-width: none !important;
  padding: 0 !important;
}

.label-group{
  margin: 0 0.2rem;
}

.image-box {
  min-height: 15dvh;
  display: flex;
  justify-content: center;
  width: 100%;
  background: rgb(128, 128, 128);
}

.info-box{
  margin: 20px auto;
  padding: 0 25px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: center;
  max-width: var(--max-width);
}
.info-area{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.action-area .el-button{
  width: 150px;
}
.action-area{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;

}
.related-photo-area{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: var(--max-width);
  margin: 0 auto;
}
.info-label{
  min-width: 9em;
}
</style>
<style>
@media only screen and (max-width: 701px) {
  .image-box .img {
    width: 100%;
    height: auto;
  }
  .info-box{
    font-size: 0.9rem;
  }
  .label-group{
    min-width: 130px;
  }
  .info-area{
    margin-bottom: 1rem;
  }
  .user-info.label-group{
    display: flex;
    flex-direction: row;
  }
  .user-info .username{
    margin-right: 3em;
  }
}

@media only screen and (min-width: 701px) {
  .info-box{
    font-size: 1.1rem;
  }
  .image-box img {
    width: auto;
    max-width: 100%;
    max-height: calc(100dvh - 64px);
    object-fit: contain;
  }
  .label-group{
    min-width: 200px;
  }
}
</style>