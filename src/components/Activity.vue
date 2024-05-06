<script setup lang="ts">

</script>

<template>
<div class="content-box">
  <div class="content-box-title">
    <h2>近期活动</h2>
  </div>
  <div class="content-box-main">
    <div class="activity-box">
      <div class="activity-title">
        2024空军航空开放活动
      </div>
    </div>
    <div class="activity-box">
      <div class="activity-title">
        2024空军航空开放活动
      </div>
    </div>
    <div class="activity-box">
      <div class="activity-title">
        2024空军开放日
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.activity-title{
  font-size: 1.4rem;
  color: white;
  font-weight: bold;
  text-align: center;
}
.activity-box{
  padding: 40px 0 0 0;
  margin: 0 15px;
  background: url("https://cdn.photo.tp.794td.cn/min/photos/10932.jpg") no-repeat center;
  height: 200px;
  max-width: calc( (var(--max-width) - 30px) / 3 );
  display: flex;
  justify-content: center;
}
@media only screen and (min-width: 701px) {
  .activity-box {
    margin: 0 15px;
    width: calc(100% / 3 - 30px);
  }
}

@media only screen and (max-width: 701px) {
  .activity-box:nth-child(1){
    width: 100%;
    margin: 0 0;
  }
  .activity-box:nth-child(n+2){
    margin: 2vh 5px 0 5px;
    width: calc(100% / 2 - 10px);;
  }
}
</style>