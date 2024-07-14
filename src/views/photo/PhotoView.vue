<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {STATIC_RESOURCE_URL} from "@/config";
import {useRoute} from "vue-router";
import ServerRequest from "@/utils/request";
import router from "@/router";
import {Checked, User} from "@element-plus/icons-vue";
import InfoLabel from "@/components/InfoLabel.vue";
import ContactPanel from "@/components/ContactPanel.vue";
import type {FullPhotoInfo, PhotoInfo} from "@/utils/type/photo";
import {RemoteSearch} from "@/utils/remoteSearch";
import type {PhotoSearchResult, SearchType} from "@/utils/type/remoteSearch";
import Thumbnail from "@/components/Thumbnail.vue";
import Device from "@/utils/device";

const airportText = ref("")
const showContactPanel = ref(false);
const route = useRoute();
const photoId = route.params.id;
const url = computed(() => `${STATIC_RESOURCE_URL}/photos/${photoId}.jpg`);
const photoInfo = ref<FullPhotoInfo>()
const relatedPhotoList = ref<PhotoSearchResult[]>([]);

async function SearchRelatedPhoto(){
  const searchGroup = await Promise.all([
      RemoteSearch.photo('reg',<string>photoInfo.value?.ac_reg,-1,5),
      RemoteSearch.photo('airport',<string>photoInfo.value?.airport_icao_code,-1,5),
      RemoteSearch.photo('user',<string>photoInfo.value?.username,-1,5),
  ]);

  relatedPhotoList.value = searchGroup
      .reduce( (list, item) => list.concat(item))
      .filter( item => item.id !== Number(photoId))

  const listLen = relatedPhotoList.value.length;
  if (Device.isPhone() && listLen > 2) {
    relatedPhotoList.value = relatedPhotoList.value.slice(0, listLen - ( listLen % 2 ));
  }else if (listLen > 4){
    relatedPhotoList.value = relatedPhotoList.value.slice(0, listLen - ( listLen % 4 ));
  }
}

onMounted(async () => {
  const photoInfoReq = new ServerRequest('GET', `/photo/${photoId}`);
  photoInfoReq.success = () => photoInfo.value = photoInfoReq.getData() as FullPhotoInfo;
  photoInfoReq.error = () => router.push('/')
  await photoInfoReq.send();

  if(photoInfo.value?.photo_time){
    photoInfo.value.photo_time = photoInfo.value.photo_time.split('T')[0]
  }
  airportText.value = photoInfo.value?.airport_icao_code as string;
  if(photoInfo.value?.airport_iata_code){
    airportText.value = photoInfo.value.airport_iata_code + "/" + airportText.value
  }
  await SearchRelatedPhoto();

})

const searchLink = (type:SearchType,ctx:string|undefined) => ctx ? `/search?type=${type}&ctx=${ctx}` : " ";
</script>

<template>
  <div class="photo-view">
    <div class="image-box">
      <img :src="url" alt=""/>
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
              label="航空公司/运营人" :value="photoInfo?.airline"
          />
          <InfoLabel
              label="机场代码" :value="airportText"
              :link="searchLink('airport',photoInfo?.airport_icao_code)"
          />
          <InfoLabel label="机场" :value="photoInfo?.airport_cn"/>
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
          <el-button type="primary">
            <el-icon><Checked /></el-icon>
            为这张图片投票
          </el-button>
        </div>
        <div>
          <el-button type="primary" @click="showContactPanel=true">
            <el-icon><User /></el-icon>
            联系摄影师
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
        :airline="photo.airline"
        :username="photo.username"
        :air-type="photo.ac_type"
      />
    </div>
    <ContactPanel v-model="showContactPanel" v-bind:photoInfo="photoInfo as FullPhotoInfo" />
  </div>
</template>

<style scoped>
.photo-view {
  width: 100% !important;
  max-width: none;
  padding: 0 !important;
  margin: 0 auto 48px 0 !important;

}
.label-group{
  margin: 0 0.2rem;
}
.image-box {
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
.action-area div{
  margin: 1rem;
}
.action-area .el-button{
  width: 150px;
}
.related-photo-area{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: var(--max-width);
  margin: 0 auto;
}
@media only screen and (max-width: 701px) {
  .image-box img {
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
    justify-content: left;
  }
  .user-info.label-group{
    display: flex;
    width: 100%;
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
    height: 100%;
    max-width: 100%;
    max-height: calc(100vh - 64px);
    object-fit: contain;
  }
  .label-group{
    min-width: 200px;
  }
}
</style>