<script setup lang="ts">
import useUserInfoStore from "@/stores/userInfo";
import Thumbnail from "@/components/Thumbnail.vue";
import {onMounted, ref} from "vue";
import serverRequest from "@/utils/request";
import router from "@/router";
import AccountSetting from "@/components/AccountSetting.vue";
import type {UserSelfInfo} from "@/utils/type/user";
import type {AirportData} from "@/utils/type/airport";
import type {PhotoInfo} from "@/utils/type/photo";

const user = useUserInfoStore();

const photoList = ref<PhotoInfo[]>([]);
const userInfo = ref<UserSelfInfo>();
const airportText = ref("");
const backgroundCssConfig = ref("");
onMounted(async () => {
  const userInfoReq = new serverRequest('GET', `/user/${user.id}`,);
  userInfoReq.success = () => {
    photoList.value = userInfoReq.getData('photoList')
    userInfo.value = userInfoReq.getData('userInfo')
    backgroundCssConfig.value = `linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%),
  url("https://cdn.photo.tp.794td.cn/photos/${userInfo.value?.cover_photo_id}.jpg") no-repeat center`;
  }
  await userInfoReq.send();

  const airportInfoReq = new serverRequest('GET', `/airport/${userInfo.value?.airport_id}`,);
  airportInfoReq.success = () => {
    const airportData = airportInfoReq.getData() as AirportData;
    airportText.value = airportData.icao_code + " " + airportData.airport_cn;
    if(airportData.iata_code){
      airportText.value = `${airportData.iata_code}/${airportText.value}`;
    }
  }
  await airportInfoReq.send();
})

const settingPanelVisible = ref(false)
const showProfilePanel = () => settingPanelVisible.value = true;

const logout = async () =>{
  user.clearUserInfo();
  await router.push('/')
  router.go(0)
}
</script>

<template>
  <div class="myself-page">
    <div class="self-intro">
      <div class="myself-header"></div>
      <div class="myself-content">
        <h2 id="username">{{ user.username }}</h2>
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
        <el-statistic class="statistic-item" title="过审率" :value="userInfo?.passing_rate">
          <template #suffix>
            %
          </template>
        </el-statistic>

      </div>
      <div class="action-box">
        <div class="action-item">
          <a href="/upload">上传图片</a>
          <div class="explain">从这里上传您的照片到TOGAPhotos</div>
          <a>上传队列</a>
          <div class="explain">查看正在等待审核的图片，您可以利用TOGAPhotos提供的工具自行检查您上传的图片。</div>
          <a>未过审队列</a>
          <div class="explain">查看您最近10张没有通过TOGAPhotos审核的图片，了解您的图片没能通过审核的原因</div>
          <a @click="showProfilePanel">账户设置</a>
          <div class="explain">更改账户信息，调整您对第三方的授权</div>
          <a style="color: #ff4d4a;" @click="logout()">退出登陆</a>
          <div class="explain">退出当前账户，注销本地存储的凭据</div>
        </div>
      </div>
    </div>
    <div class="photo-box">
      <Thumbnail v-for="photo in photoList" :key="photo.id"
                 :id="photo.id"
                 :reg="photo.ac_reg"
                 :airline="photo.airline"
                 :airType="photo.ac_type"
      />
    </div>
    <AccountSetting v-model="settingPanelVisible" />
  </div>
</template>

<style scoped>
.myself-page {
  display: flex;
  flex-wrap: wrap;
}

.self-intro {
  justify-content: center;
}

.myself-header {
  width: 100%;
  background: v-bind(backgroundCssConfig) ;
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
  .photo-box{
    width: 60%;
  }

  .photo-box {
    margin: 24px 0 0 0;
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