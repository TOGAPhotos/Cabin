<script setup lang="ts">
import {CameraFilled, PictureFilled, UserFilled, Promotion} from "@element-plus/icons-vue";
import TransparentButton from "@/component/firstScreen/TransparentButton.vue"
import {onMounted, reactive} from "vue";
import ServerRequest from "@/utils/request";
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

const websiteInfoReq = new ServerRequest('GET','/website?type=statistics');
websiteInfoReq.success = () =>{
  const data = websiteInfoReq.getData();
  statisticInfo.userNum = data['userNum'];
  statisticInfo.uploadQueueLen = data['uploadQueueLen'];
  statisticInfo.photoNum = data['photoNum'];
}
websiteInfoReq.error = () => router.push('/maintenance');

function daysSince(date: Date): number {
  const today = new Date();
  const timeDifference = today.getTime() - date.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference;
}

const targetDate = new Date("2023-05-03");
const daysPassed = daysSince(targetDate);

onMounted(() => websiteInfoReq.send())
</script>

<template>
  <div class="content-box statistic-container">
    <div class="content-box-title">
      <h2>关于 TOGAPhotos</h2>
    </div>
    <div class="content-box-desc">
      <p>TOGAPhotos是一个由航空爱好者发起和维护的图库项目，我们诚挚的欢迎每一位新用户的到来，你们的支持是图库继续发展的最大动力</p>
      <div class="btn-box">
        <TransparentButton :isWhite="false"></TransparentButton>
        <TransparentButton :isWhite="false" :href="'https://blog.togaphotos.com/'" :isNewPage="true">关于我们</TransparentButton>
      </div>
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
          <h4>当前队列长度</h4>
          <strong>{{ statisticInfo.uploadQueueLen }}</strong>
        </div>
      </div>
      <div class="statistic">
        <div class="icon">
          <PictureFilled/>
        </div>
        <div class="content">
          <h4>注册用户数量</h4>
          <strong>{{ statisticInfo.userNum }}</strong>
        </div>
      </div>
      <div class="statistic">
        <div class="icon">
          <CameraFilled />
        </div>
        <div class="content">
          <h4>收录图片数量</h4>
          <strong>{{ statisticInfo.photoNum }}</strong>
        </div>
      </div>
      <div class="statistic">
        <div class="icon">
          <Promotion/>
        </div>
        <div class="content">
          <h4>本站累计运行</h4>
          <strong>{{ daysPassed }} <span>天</span></strong>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.statistic-container{
  /* background-color: red; */
  padding-top: 6rem;
  padding-bottom: 6rem;
}
.statistic-info{
  justify-content: space-between;
}
.statistic {
  height: 6rem;
  flex: 1;
  padding: 0.9rem 1.2rem;
  text-align: center;
  display: flex;
  background-color: #FFFFFF;
  margin-right: 1rem;
  border-radius: 6px;
  transition: transform 0.3s ease;
}
.statistic:hover {
  box-shadow: 0.15rem 0.3rem 0.6rem rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transform: translateY(-0.15rem);
}
.statistic:last-child{
  margin-right: 0;
}
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
@media only screen and (max-width: 841px){
  .statistic-info{
    flex-direction: column;
  }
  .statistic{
    height: 6rem;
    width: 100%;
    margin-right: 0;
    margin-bottom: 1rem;
  }
  .statistic:last-child{
    margin-bottom: 0;
  }
}
</style>