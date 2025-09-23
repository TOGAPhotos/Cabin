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
import { onMounted, reactive, ref } from "vue";

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
const load = ref(true);

onMounted(async () => {
  load.value = true;
  const websiteInfoReq = new ServerRequest("GET", "/website?type=statistics");
  websiteInfoReq.success = () => {
    load.value = false;
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
  <el-skeleton animated :loading="load">
    <template #template>
      <div class="grid grid-cols-2 sm:max-lg:grid-cols-4 gap-4">
        <ContentBox>
          <template #icon>
            <PictureFilled />
          </template>
          <template #title>队列长度</template>
          <template #content>
            <el-skeleton-item variant="text" style="width: 100%" />
          </template>
        </ContentBox>
        <ContentBox>
          <template #icon>
            <UserFilled />
          </template>
          <template #title>用户数量</template>
          <template #content>
            <el-skeleton-item variant="text" style="width: 100%" />
          </template>
        </ContentBox>
        <ContentBox>
          <template #icon>
            <Management />
          </template>
          <template #title>入库图片</template>
          <template #content>
            <el-skeleton-item variant="text" style="width: 100%" />
          </template>
        </ContentBox>
        <ContentBox>
          <template #icon>
            <Promotion />
          </template>
          <template #title>累计运行</template>
          <template #content>
            <el-skeleton-item variant="text" style="width: 100%" />
          </template>
        </ContentBox>
      </div>
    </template>
    <template #default>
      <div class="grid grid-cols-2 sm:max-lg:grid-cols-4 gap-4">
        <ContentBox>
          <template #icon>
            <PictureFilled />
          </template>
          <template #title>队列长度</template>
          <template #content>
            <div>{{ statisticInfo.uploadQueueLen }}</div>
          </template>
        </ContentBox>
        <ContentBox>
          <template #icon>
            <UserFilled />
          </template>
          <template #title>用户数量</template>
          <template #content>
            <div>{{ statisticInfo.userNum }}</div>
          </template>
        </ContentBox>
        <ContentBox>
          <template #icon>
            <Management />
          </template>
          <template #title>入库图片</template>
          <template #content>
            <div>{{ statisticInfo.photoNum }}</div>
          </template>
        </ContentBox>
        <ContentBox>
          <template #icon>
            <Promotion />
          </template>
          <template #title>累计运行</template>
          <template #content>
            <div>{{ `${daysPassed} 天` }}</div>
          </template>
        </ContentBox>
      </div>
    </template>
  </el-skeleton>
</template>

<style scoped></style>
