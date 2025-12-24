<script setup lang="ts">
import AccountSetting from "@/component/AccountSetting.vue";
import PhotoCard from "@/components/PhotoCard.vue";
import router from "@/router";
import useUserInfoStore from "@/stores/userInfo";
import Device from "@/utils/device";
import Permission from "@/utils/permission";
import { PhotoUrl, ThumbnailUrl } from "@/utils/photo-url";
import ServerRequest from "@/utils/request";
import type { AirportData } from "@/utils/type/airport";
import type { AcceptPhoto } from "@/utils/type/photo";
import type { UserSelfInfo } from "@/utils/type/user";
import { onMounted, ref, useTemplateRef } from "vue";

const user = useUserInfoStore();

const photoList = ref<AcceptPhoto[]>([]);
const userInfo = ref<UserSelfInfo>();
const airportText = ref("");
const headerElm = useTemplateRef<HTMLElement>("header-photo");
onMounted(async () => {
  const userInfoReq = new ServerRequest("GET", `/user/${user.id}`);
  userInfoReq.success = () => {
    photoList.value = userInfoReq.getData("photoList");
    userInfo.value = userInfoReq.getData("userInfo");
    user.username = userInfo.value!.username;
  };
  await userInfoReq.send();
  if (userInfo.value?.cover_photo_id) {
    headerElm.value!.style.background = `linear-gradient(rgba(247, 248, 250, 0) 0%, rgba(247, 248, 250, 1) 100%),
      url("${Device.isPhone() ? ThumbnailUrl(userInfo.value.cover_photo_id) : PhotoUrl(userInfo.value.cover_photo_id)}") no-repeat center/cover`;
  }
  if (userInfo.value?.airport_id) {
    const airportInfoReq = new ServerRequest(
      "GET",
      `/airport/${userInfo.value.airport_id}`,
    );
    airportInfoReq.success = () => {
      const airportData = airportInfoReq.getData() as AirportData;
      airportText.value = airportData.icao_code + " " + airportData.airport_cn;
      if (airportData.iata_code) {
        airportText.value = `${airportData.iata_code}/${airportText.value}`;
      }
    };
    await airportInfoReq.send();
  }
});

const settingPanelVisible = ref<boolean>(false);

const logout = async () => {
  user.clearUserInfo();
  await router.push("/");
  router.go(0);
};

const summary2025 = () => {
  const origin = window.location.host;
  const newWindow = window.open("https://summary." + origin, "_blank");
  window.addEventListener(
    "message",
    (event) => {
      if (
        event.origin !== "http://localhost:5173" &&
        event.origin !== "https://summary.togaphotos.com" &&
        event.origin !== "https://summary.toga.photos"
      ) {
        return;
      }
      if (event.data.type === "requestUserId") {
        console.log("Received request for user token");
        event.source?.postMessage(
          { token: user.token },
          { targetOrigin: event.origin },
        );
      }
    },
    { once: true },
  );
};
</script>

<template>
  <div id="myself-page" class="page-box">
    <div class="self-intro">
      <div ref="header-photo" class="myself-header"></div>
      <div class="myself-content">
        <h2 id="username">{{ userInfo?.username }}</h2>
        <div id="home-base">
          <div class="airport">{{ airportText }}</div>
        </div>
      </div>
      <div class="statistic-box">
        <el-statistic
          class="statistic-item"
          title="入库数量"
          :value="userInfo?.total_photo"
        />
        <el-statistic
          class="statistic-item"
          title="过审率"
          :value="userInfo?.passing_rate"
        >
          <template #suffix> % </template>
        </el-statistic>
      </div>
      <div class="action-box">
        <div class="action-card">
          <a href="/upload">上传图片</a>
          <div class="explain">从这里上传您的照片到TOGAPhotos</div>
        </div>
        <div class="action-card">
          <a href="/queue/upload">上传队列</a>
          <div class="explain">
            查看正在等待审核的图片，您可以利用TOGAPhotos提供的工具自行检查您上传的图片。
          </div>
        </div>
        <div class="action-card">
          <a href="/queue/reject">未过审队列</a>
          <div class="explain">
            查看您最近10张没有通过TOGAPhotos审核的图片，了解您的图片没能通过审核的原因
          </div>
        </div>
        <div class="action-card">
          <a @click="settingPanelVisible = true">账户设置</a>
          <div class="explain">更改账户信息，调整您对第三方的授权</div>
        </div>
        <div class="action-card" v-if="Permission.isStaff(user.permission)">
          <a @click="summary2025">2025年度总结</a>
          <div class="explain">看一看你和我们一起走过的2025年</div>
        </div>
        <div class="action-card">
          <a style="color: #ff4d4a" @click="logout()">退出登录</a>
          <div class="explain">退出当前账户，注销本地存储的凭据</div>
        </div>
      </div>
    </div>
    <div class="photo-box">
      <div class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <PhotoCard v-for="photo in photoList" v-bind="photo" :key="photo.id" />
      </div>
    </div>
    <AccountSetting v-model="settingPanelVisible" />
  </div>
</template>

<style scoped>
#myself-page {
  display: flex;
  flex-wrap: wrap;
  max-width: 1280px;
  margin: 0 auto;
}

.self-intro {
  justify-content: center;
}

.myself-header {
  width: 100%;
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

  .self-intro {
    width: 100%;
  }

  .photo-box {
    width: 100%;
  }

  .photo-box {
    margin: 24px 0 0 0;
  }

  .thumbnail {
    width: calc(100% / 3 - 12px) !important;
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

  .self-intro,
  .photo-box {
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

@media only screen and (max-width: 701px) {
  .action-box {
    grid-template-columns: repeat(2, 1fr);
  }
}

.action-card {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  background-color: #fff;
  transition: all 0.3s;
}

.action-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.action-card a {
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  cursor: pointer;
}

.explain {
  font-size: 12px;
  color: #909399;
  margin: 0;
}
</style>
