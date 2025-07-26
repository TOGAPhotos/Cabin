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
</template>

<style scoped></style>
