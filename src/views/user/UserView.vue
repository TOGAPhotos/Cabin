<script setup lang="ts">
import {useRoute} from "vue-router";
import router from "@/router";
import useUserInfoStore from "@/stores/userInfo";
import Thumbnail from "@/components/Thumbnail.vue";
import {ref, onMounted, useTemplateRef} from "vue";
import ServerRequest from "@/utils/request";
import type {AirportData} from "@/utils/type/airport";
import type {BasicUserInfo} from "@/utils/type/user";
import { PhotoUrl } from "@/utils/photo-url";

const route = useRoute();
const userId = route.params.id;

// ==== Pre Check ====
if(!userId){
  router.go(-1);
}
if (Number(userId) === useUserInfoStore().id){
  router.replace("/myself");
}
// ==== Pre Check ====

const userInfo = ref<BasicUserInfo>();
const photoList = ref();
const headerElm = useTemplateRef<HTMLElement>("header-photo")
const airportText = ref("");

onMounted(async ()=>{
  const userInfoReq = new ServerRequest('GET', `/user/${userId}`,);
  userInfoReq.success = () => {
    photoList.value = userInfoReq.getData('photoList')
    userInfo.value = userInfoReq.getData('userInfo')
    headerElm.value!.style.background = `linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%),
    url("${PhotoUrl(userInfo.value!.cover_photo_id)}") no-repeat center`;
  }
  await userInfoReq.send();

  const airportInfoReq = new ServerRequest('GET', `/airport/${userInfo.value?.airport_id}`,);
  airportInfoReq.success = () => {
    const airportData = airportInfoReq.getData() as AirportData;
    airportText.value = airportData.icao_code + " " + airportData.airport_cn;
    if(airportData.iata_code){
      airportText.value = `${airportData.iata_code}/${airportText.value}`;
    }
  }
  await airportInfoReq.send();
})
</script>
<template>
  <div id="user-page" class="page-box">
    <div class="self-intro">
      <div ref="header-photo" class="myself-header"></div>
      <div class="myself-content">
        <h2 id="username">{{ userInfo?.username }}</h2>
        <div id="home-base">
          <div class="airport">{{ airportText }}</div>
        </div>
        <div class="badge-box">
          <el-popover class="badge" :width="300">
            <template #default>
              <img class="badge-big" src="https://cdn.photo.tp.794td.cn/badge/Badge_IB.jpg" alt=""/>
            </template>
            <template #reference>
              <img class="badge-small" src="https://cdn.photo.tp.794td.cn/badge/Badge_IB.jpg" alt=""/>
            </template>
          </el-popover>
          <el-popover :width="300">
            <template #default>
              <img class="badge-big" src="https://cdn.photo.tp.794td.cn/badge/Badge_IB.jpg" alt=""/>
            </template>
            <template #reference>
              <img class="badge-small" src="https://cdn.photo.tp.794td.cn/badge/Badge_IB.jpg" alt=""/>
            </template>
          </el-popover>
          <el-popover :width="300">
            <template #default>
              <img class="badge-big" src="https://cdn.photo.tp.794td.cn/badge/Badge_IB.jpg" alt=""/>
            </template>
            <template #reference>
              <img class="badge-small" src="https://cdn.photo.tp.794td.cn/badge/Badge_IB.jpg" alt=""/>
            </template>
          </el-popover>
          <el-popover :width="300">
            <template #default>
              <img class="badge-big" src="https://cdn.photo.tp.794td.cn/badge/Badge_IB.jpg" alt=""/>
            </template>
            <template #reference>
              <img class="badge-small" src="https://cdn.photo.tp.794td.cn/badge/Badge_IB.jpg" alt=""/>
            </template>
          </el-popover>
        </div>
      </div>
      <div class="statistic-box">
        <el-statistic class="statistic-item" title="入库数量" :value="userInfo?.total_photo"/>
      </div>
    </div>
    <div class="photo-box">
      <Thumbnail v-for="photo in photoList" :key="photo.id"
                 :id="photo.id"
                 :reg="photo.ac_reg"
                 :airline="photo.airline_cn || photo.airline_en"
                 :airType="photo.ac_type"
      />
    </div>
  </div>
</template>

<style scoped>
#user-page {
  display: flex;
  flex-wrap: wrap;
}

.self-intro {
  justify-content: center;
}

.myself-header {
  width: 100%;
  /*background: v-bind(backgroundCssConfig) ;*/
  background-size: cover;
}

.myself-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media only screen and (min-width: 701px) {
  .myself-page {
    padding: 0 15px;
  }

  .myself-header {
    height: 240px;
  }

  .self-intro{
    width: 40%;
  }

  .photo-box {
    width: 60%;
    margin: 24px 0 0 0;
    height: calc(100vh - 190px);
    overflow-y: auto;
  }
  .thumbnail{
    width: calc(100%/3 - 12px)!important;
  }
}

@media only screen and (min-width: 701px) and (max-width: 1330px) {
  .myself-page {
    padding: 0 !important;
  }
}

@media only screen and (max-width: 701px) {
  .myself-page {
    padding: 0;
  }

  .myself-header {
    height: 15vh;
  }

  .self-intro, .photo-box {
    width: 100%;
  }
}

#username {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

#home-base {
  margin: 12px 0 0 0;
}

.airport {
  text-align: center;
  font-size: 12px;
  color: #a4a4a8;
}

.badge-box {
  display: flex;
  flex-wrap: wrap;
  padding: 12px 24px;
  justify-content: center;
}

.badge-big {
  width: 100%;
  height: auto;
}

.badge-small {
  width: 32vw;
  max-width: 100px;
  height: auto;
  margin: 0 8px 6px 8px;
}

.photo-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 15px 0 15px;
  align-content: start;
}

.statistic-box {
  display: flex;
  justify-content: center;
}

.statistic-item {
  margin: 0 12px;
}
.action-box {
  margin: 12px;
  border: #b1b3b8 solid 1px;
  font-size: 0.9rem;
  padding: 0.5rem;
}
.explain{
  margin: 0 0 0.4em 0;
}
</style>