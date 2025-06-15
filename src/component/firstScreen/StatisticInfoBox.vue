<script setup lang="ts">
import TransparentButton from "@/component/firstScreen/TransparentButton.vue";
import ContentBox from "@/components/ContentBox.vue";
import router from "@/router";
import ServerRequest from "@/utils/request";
import {
  CameraFilled,
  PictureFilled,
  Promotion,
  UserFilled,
} from "@element-plus/icons-vue";
import { onMounted, reactive } from "vue";

const statisticInfo = reactive({
  userNum: 0,
  uploadQueueLen: 0,
  photoNum: 0,
  runTime: runTime(),
});

function runTime(): string {
  const delta = Date.now() - new Date("2023-05-03").getTime();
  let days = Math.floor(delta / (1000 * 60 * 60 * 24));

  const years = Math.floor(days / 365);
  days = days % 365;
  const months = Math.floor(days / 30);
  days = days % 30;

  return `共运行${years}年${months}月${days}日`;
}

const websiteInfoReq = new ServerRequest("GET", "/website?type=statistics");
websiteInfoReq.success = () => {
  const data = websiteInfoReq.getData();
  statisticInfo.userNum = data["userNum"];
  statisticInfo.uploadQueueLen = data["uploadQueueLen"];
  statisticInfo.photoNum = data["photoNum"];
};
websiteInfoReq.error = () => router.push("/maintenance");

function daysSince(date: Date): number {
  const today = new Date();
  const timeDifference = today.getTime() - date.getTime();
  return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
}

const targetDate = new Date("2023-05-03");
const daysPassed = daysSince(targetDate);

const statistics = [
  {
    icon: UserFilled,
    title: "当前队列长度",
    content: statisticInfo.uploadQueueLen,
  },
  {
    icon: PictureFilled,
    title: "注册用户数量",
    content: statisticInfo.userNum,
  },
  {
    icon: CameraFilled,
    title: "收录图片数量",
    content: statisticInfo.photoNum,
  },
  {
    icon: Promotion,
    title: "本站累计运行",
    content: `${daysPassed} 天`,
  },
];
onMounted(() => websiteInfoReq.send());
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
      <ContentBox v-for="(item, index) in statistics" :key="index">
        <template #icon>
          <component :is="item.icon" />
        </template>
        <template #title>{{ item.title }}</template>
        <template #content>{{ item.content }}</template>
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
