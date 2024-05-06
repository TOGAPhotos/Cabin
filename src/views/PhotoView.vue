<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {staticResourceUrl} from "@/config";
import {useRoute} from "vue-router";
import serverRequest from "@/utils/request";
import router from "@/router";

type PhotoData = {
  airline: string,
  airport_id: number,
  allow_socialmedia: number,
  cn_name: string,
  iata: string,
  icao: string,
  manufacturer: string,
  msn: number,
  photo_time: string,
  reg: string,
  remark: string,
  sub_type: string,
  uploader: number,
  uploader_id: number,
}

const route = useRoute();
const photoId = route.params.id;
const url = computed(() => `${staticResourceUrl}/photos/${photoId}.jpg`);
const photoInfo = ref<PhotoData>()

onMounted(async () => {
  const photoInfoReq = new serverRequest('GET', `/photo/${photoId}`);
  photoInfoReq.success = () => photoInfo.value = photoInfoReq.getData('photoInfo') as PhotoData
  photoInfoReq.error = () => router.push('/')
  await photoInfoReq.start()
})

</script>

<template>
  <div class="photo-view">
    <div class="image-box">
      <img :src="url" alt=""/>
    </div>
    <div class="info-box">
      <div class="content-box">
        <div class="content-box-title">
          <h4>航空器信息</h4>
        </div>
        <div class="content-box-main">
          <div>
            注册号：<a :href="`/search?ctx=` + photoInfo?.reg + `&type=reg`" target="_blank">{{photoInfo?.reg}}</a>
          </div>
          <div>
            机型：{{photoInfo?.manufacturer}} / {{photoInfo?.sub_type}}
          </div>
          <div>
            航司：
            <a :href="`/search?ctx=` + photoInfo?.airline + `&type=airline`" target="_blank">
            {{photoInfo?.airline}}
            </a>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="content-box-title">
          <h4>机场信息</h4>
        </div>
        <div class="content-box-main">
          <div>
            机场：<a :href="`/search?ctx=` + photoInfo?.cn_name + `&type=airport`" target="_blank">
            {{photoInfo?.iata}}<span v-if="photoInfo?.iata">/</span>{{photoInfo?.icao}}-{{ photoInfo?.cn_name }}
          </a>
          </div>
        </div>

      </div>
      <div class="content-box">
        <div class="content-box-title">
          <h4>摄影师信息</h4>
        </div>
        <div class="content-box-main">
          <div>
            摄影师：<a :href="'/user/' + photoInfo?.uploader_id" >{{photoInfo?.uploader}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-view {
  width: 100% !important;
  max-width: none;
  padding: 0 !important;
  margin: 0 auto 48px 0 !important;

}

.image-box {
  display: flex;
  justify-content: center;
  width: 100% !important;
  background: rgb(128, 128, 128);
}

.info-box {
  margin: 24px auto;
  padding: 0 15px;
  max-width: var(--max-width);

  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

}

.info-box .content-box-main {
  font-size: 14px;
  flex-direction: column;
  justify-content: start;
}

@media only screen and (max-width: 701px) {
  .image-box img {
    width: 100%;
    height: auto;
  }
}

@media only screen and (min-width: 701px) {
  .image-box img {
    width: auto;
    height: 100%;
    max-width: 100%;
    max-height: calc(100vh - 64px);
    object-fit: contain;
  }
}
</style>