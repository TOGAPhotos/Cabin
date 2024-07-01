<script setup lang="ts">
import {CameraFilled, PictureFilled, UserFilled} from "@element-plus/icons-vue";
import {onMounted, reactive} from "vue";
import serverRequest from "@/utils/request";
import router from "@/router";

const statisticInfo = reactive({
  userNum:0,
  uploadQueueLen:0,
  photoNum:0
})

const websiteInfoReq = new serverRequest('GET','/website');
websiteInfoReq.success = () =>{
  const data = websiteInfoReq.getData('homepageInfo')
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
      <div class="statistic">
        <div class="icon">
          <CameraFilled />
        </div>
        <div class="content">
          <h4>队列长度</h4>
          <strong>{{ statisticInfo.uploadQueueLen }}</strong>
        </div>
      </div>
      <div class="statistic">
        <div class="icon">
          <UserFilled />
        </div>
        <div class="content">
          <h4>用户数量</h4>
          <strong>{{ statisticInfo.userNum }}</strong>
        </div>
      </div>
      <div class="statistic">
        <div class="icon">
          <PictureFilled/>
        </div>
        <div class="content">
          <h4>图片数量</h4>
          <strong>{{ statisticInfo.photoNum }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.statistic-info{
  justify-content: space-evenly;
}
@media only screen and (max-width: 701px){
  .statistic-info{
    flex-direction: column;
  }
  .statistic{
    margin-bottom: 1rem;
  }
}
.statistic {
  display: flex;
  justify-content: center;
  align-items: center;
}
.statistic .icon {
  width: 2rem;
  margin-right: 0.5em;
}
.statistic strong {
  font-weight: 500;
  font-size: 1.5rem;
}
</style>