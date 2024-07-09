<script setup lang="ts">
import {CameraFilled, PictureFilled, UserFilled} from "@element-plus/icons-vue";
import {onMounted, reactive,ref} from "vue";
import serverRequest from "@/utils/request";
import router from "@/router";

const statisticInfo = reactive({
  userNum:0,
  uploadQueueLen:0,
  photoNum:0,
  runTime:runTime(),
})

function runTime(): string {
  const delta =  Date.now() - new Date("2023-05-03").getTime();
  let days = Math.floor(delta / (1000 * 60 * 60 * 24));

  const years = Math.floor(days / 365);
  days = days % 365;
  const months = Math.floor(days / 30);
  days = days % 30;

  return `共运行${years}年${months}月${days}日`;
}

const websiteInfoReq = new serverRequest('GET','/website');
websiteInfoReq.success = () =>{
  const data = websiteInfoReq.getData();
  statisticInfo.userNum = data['userNum'];
  statisticInfo.uploadQueueLen = data['uploadQueueLen'];
  statisticInfo.photoNum = data['photoNum'];
}
websiteInfoReq.error = () => router.push('/maintenance');

onMounted(() => websiteInfoReq.send())
</script>

<template>
  <div class="content-box">
    <div class="content-box-title">
      <h2>统计数据</h2>
    </div>
    <div class="content-box-main statistic-info">
<!--      <div class="statistic">-->
<!--        <div class="content">-->
<!--          <strong>{{ statisticInfo.runTime }}</strong>-->
<!--        </div>-->
<!--      </div>-->
      <div class="statistic">
        <div class="icon">
          <UserFilled />
        </div>
        <div class="content">
          <strong>{{ statisticInfo.userNum }} 名用户</strong>
        </div>
      </div>
      <div class="statistic">
        <div class="icon">
          <PictureFilled/>
        </div>
        <div class="content">
          <strong>{{ statisticInfo.photoNum }} 张图片</strong>
        </div>
      </div>
      <div class="statistic">
        <div class="icon">
          <CameraFilled />
        </div>
        <div class="content">
          <strong>{{ statisticInfo.uploadQueueLen }} 张待审核</strong>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.content-box{
  margin-left: 15px;
}
.statistic-info {
  justify-content: left;
  flex-direction: column;
}

@media only screen and (max-width: 701px){

}
.statistic {
  font-size: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;
}
.statistic .icon {
  width: 1.4em;
  margin-right: 0.5em;
}
.statistic strong {
  font-weight: 500;
}
</style>