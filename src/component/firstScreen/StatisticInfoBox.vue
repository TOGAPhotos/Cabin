<script setup lang="ts">
import TransparentButton from "@/component/firstScreen/TransparentButton.vue";
import ContentBox from "@/components/ContentBox.vue";
import router from "@/router";
import ServerRequest from "@/utils/request";
import {
  CameraFilled,
  PictureFilled,
  UserFilled,
} from "@element-plus/icons-vue";
import { onMounted, reactive } from "vue";

function daysSince(date: Date): number {
  const today = new Date();
  const timeDifference = today.getTime() - date.getTime();
  return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
}

const targetDate = new Date("2023-05-03");
const daysPassed = daysSince(targetDate);

const statisticInfo = reactive({
  userNum: null,
  uploadQueueLen: null,
  photoNum: null,
});

onMounted(async () => {
  const websiteInfoReq = new ServerRequest("GET", "/website?type=statistics");
  websiteInfoReq.success = () => {
    const data = websiteInfoReq.getData();
    Object.assign(statisticInfo, {
      ...data,
    });
  };
  websiteInfoReq.error = () => router.push("/maintenance");

  await websiteInfoReq.send();
});
</script>

<template>
  <div class="content-box">
    <div class="content-box-title">
      <h2>关于 TOGAPhotos</h2>
    </div>
    <div class="content-box-desc">
      <p>
        TOGAPhotos是一个由航空爱好者发起和维护的图库项目，我们诚挚的欢迎每一位新用户的到来，你们的支持是图库继续发展的最大动力
      </p>
      <div class="btn-box">
        <TransparentButton :isWhite="false"></TransparentButton>
        <TransparentButton
          :isWhite="false"
          :href="'https://blog.togaphotos.com/'"
          :isNewPage="true"
          >关于我们</TransparentButton
        >
      </div>
    </div>

    <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
      <ContentBox>
        <template #icon>
          <UserFilled />
        </template>
        <template #title>队列长度</template>
        <template #content>{{ statisticInfo.uploadQueueLen }}</template>
      </ContentBox>
      <ContentBox>
        <template #icon>
          <PictureFilled />
        </template>
        <template #title>用户数量</template>
        <template #content>{{ statisticInfo.userNum }}</template>
      </ContentBox>
      <ContentBox>
        <template #icon>
          <CameraFilled />
        </template>
        <template #title>入库图片</template>
        <template #content>{{ statisticInfo.photoNum }}</template>
      </ContentBox>
      <ContentBox>
        <template #icon>
          <UserFilled />
        </template>
        <template #title>累计运行</template>
        <template #content>{{ `${daysPassed} 天` }}</template>
      </ContentBox>
    </div>
  </div>
</template>
<style scoped>
.btn-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}
.statistic .icon {
  width: 2rem;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-right: 0.5em;
}
.statistic .content {
  padding-left: 0.8em;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.statistic strong {
  text-align: left;
  font-weight: 500;
  font-size: 1.5rem;
  /* vertical-align: middle; */
  /* line-height: 1.5rem; */
}
.statistic strong span {
  font-size: 1.1rem;
  font-weight: 400;
  display: inline-flex;
  align-items: baseline;
}
@media only screen and (max-width: 841px) {
  .statistic-info {
    flex-direction: column;
  }
  .statistic {
    height: 6rem;
    width: 100%;
    margin-right: 0;
    margin-bottom: 1rem;
  }
  .statistic:last-child {
    margin-bottom: 0;
  }
}
</style>
