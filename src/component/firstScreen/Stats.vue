<script setup lang="ts">
import ContentBox from "@/components/ContentBox.vue";
import router from "@/router";
import ServerRequest from "@/utils/request";
import {
  Management,
  PictureFilled,
  Promotion,
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
  <div class="global-container flex flex-col gap-8">
    <div class="flex flex-col gap-4 text-toga-dark">
      <div class="flex flex-col text-2xl tracking-wide">
        <div>
          <span class="text-3xl font-bold">TOGAPhotos</span>
          是一个由航空爱好者发起和维护的图库项目
        </div>
        <div>我们诚挚的欢迎每一位新用户的到来</div>
        <div>你们的支持是图库继续发展的最大动力</div>
      </div>
      <div
        class="flex gap-8 *:w-fit *:text-lg *:px-7 *:py-1 *:border-1 *:border-toga *:rounded-full *:transition-all *:duration-250 *:hover:text-white *:hover:font-bold *:hover:bg-toga"
      >
        <a target="_blank" href="https://blog.togaphotos.com/">关于我们</a>
        <a target="_blank" href="https://guide.togaphotos.com/">上传指南</a>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
      <ContentBox>
        <template #icon>
          <PictureFilled />
        </template>
        <template #title>队列长度</template>
        <template #content>{{ statisticInfo.uploadQueueLen }}</template>
      </ContentBox>
      <ContentBox>
        <template #icon>
          <UserFilled />
        </template>
        <template #title>用户数量</template>
        <template #content>{{ statisticInfo.userNum }}</template>
      </ContentBox>
      <ContentBox>
        <template #icon>
          <Management />
        </template>
        <template #title>入库图片</template>
        <template #content>{{ statisticInfo.photoNum }}</template>
      </ContentBox>
      <ContentBox>
        <template #icon>
          <Promotion />
        </template>
        <template #title>累计运行</template>
        <template #content>{{ `${daysPassed} 天` }}</template>
      </ContentBox>
    </div>
  </div>
</template>

<style scoped></style>
