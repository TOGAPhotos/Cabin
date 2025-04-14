<script setup lang="ts"></script>

<template>
  <div class="content-box">
    <div class="content-box-title">
      <h2>近期活动</h2>
    </div>
    <div class="content-box-main">
      <div class="activity-img">
        <div class="activity-title">2025<br />空军航空开放活动</div>
      </div>

      <!--    <div class="activity-box">-->
      <!--      <div class="activity-title">-->
      <!--        2024空军航空开放活动-->
      <!--      </div>-->
      <!--    </div>-->
      <!--    <div class="activity-box">-->
      <!--      <div class="activity-title">-->
      <!--        2024空军开放日-->
      <!--      </div>-->
      <!--    </div>-->
    </div>
  </div>
</template>

<style scoped>
.activity-title {
  position: relative;
  top: 0;
  font-weight: bold;
  text-align: center;
}
.content-box-main {
  flex-direction: column;
}

.activity-img {
  background:
    linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)),
    url("https://cdn.photo.tp.794td.cn/photos/12072.jpg") no-repeat center 30%;
  background-size: cover;
  display: flex;
  border-radius: 5px;
  border: 2px #cccc solid;
  justify-content: center;
  margin: 1rem 0;
  padding: 2rem 0;
}
</style>
