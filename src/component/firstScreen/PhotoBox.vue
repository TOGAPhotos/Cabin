<script setup lang="ts">
import { type CSSProperties, onMounted, ref } from "vue";
import { STATIC_RESOURCE_URL } from "@/config";
import { CameraFilled } from "@element-plus/icons-vue";
import type { AcceptPhoto } from "@/utils/type/photo";
const props = withDefaults(
  defineProps<{
    photoInfo: AcceptPhoto;
    isMobile?: boolean;
  }>(),
  {
    isMobile: false,
  },
);

function processHeadPhoto(imgId: number): CSSProperties {
  return {
    backgroundImage: `url(${STATIC_RESOURCE_URL}/photos/${imgId}.jpg)`,
  };
}
</script>

<template>
  <div v-if="!isMobile">
    <a :href="'/photo/' + photoInfo.id">
      <div class="photo" :style="processHeadPhoto(photoInfo.id)">
        <div class="photo-info-container">
          <div class="basic-info">
            <i class="iconfont toga-paizhao icon"></i> {{ photoInfo.username }}
          </div>
          <div class="extra-info">
            <div class="extra-info-text">
              <i class="iconfont toga-plane icon"></i>
              {{ photoInfo.airline_cn || photoInfo.airline_en }} |
              {{ photoInfo.ac_type }}
            </div>
            <div class="extra-info-text">
              <i class="iconfont toga-bianhao icon"></i> {{ photoInfo.ac_reg }}
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
  <div v-else>
    <a :href="'/photo/' + photoInfo.id" class="photo-mobile">
      <div class="img" :style="processHeadPhoto(photoInfo.id)"></div>
      <ul class="photo-info-container-mobile">
        <li>
          <i class="iconfont toga-paizhao icon-mobile"></i>
          {{ photoInfo.username }}
        </li>
        <li>
          <i class="iconfont toga-plane icon-mobile"></i>
          {{ photoInfo.airline_cn || photoInfo.airline_en }} |
          {{ photoInfo.ac_type }}
        </li>
        <li>
          <i class="iconfont toga-bianhao icon-mobile"></i>
          {{ photoInfo.ac_reg }}
        </li>
      </ul>
    </a>
  </div>
</template>

<style scoped>
.photo {
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-width: 265px;
  border-radius: 0.4rem;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}
.photo-info-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0.1rem 0.5rem;
  background-color: rgba(0, 0, 0, 0.4);
  font-size: 1rem;
  text-align: start;
  transform: translateY(60%);
  transition: transform 0.3s ease;
}
.photo:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.8);
  transform: scale(1.05);
}
.photo:hover .photo-info-container {
  transform: translateY(0);
}
.basic-info {
  width: 100%;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.extra-info {
  margin-top: 0.1rem;
  display: flex;
  flex-direction: column;
  align-items: start;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 700;
}
.extra-info-text {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon {
  color: rgba(255, 255, 255, 0.65);
}

.photo-mobile {
  display: block;
  overflow: hidden;
  /* min-width: 100px; */
  width: 100%;
  /* max-width: 18rem; */
  min-height: 0;
  border-radius: 0.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  background-color: rgba(0, 0, 0, 0.8);
}
.photo-mobile .img {
  width: 100%;
  /* height: 100%; */
  aspect-ratio: 16 / 9;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center center;
}
.photo-info-container-mobile {
  display: block;
  width: 100%;
  color: #f7f8fa;
  font-size: 0.65rem;
  padding: 0.5rem 2rem;
}
.photo-info-container-mobile li {
  list-style-type: none;
  padding-left: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon-mobile {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
}
</style>
