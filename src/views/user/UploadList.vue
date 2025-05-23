<script setup lang="ts">
import InfoLabel from "@/components/InfoLabel.vue";
import { RawPhotoUrl, ThumbnailUrl } from "@/utils/photo-url";
import ServerRequest from "@/utils/request";
import { OpenToolWindow } from "@/utils/tool-page";
import type { AcceptPhoto } from "@/utils/type/photo";
import { ref } from "vue";

interface _FullPhotoInfo extends AcceptPhoto {
  queueIndex: number;
  airport: string;
  message: string;
  storage_status: string;
}

const uploadQueue = ref<_FullPhotoInfo[]>();
(async () => {
  const infoReq = new ServerRequest("GET", "/queue/upload");
  infoReq.success = () => {
    uploadQueue.value = infoReq.getData("photoQueue") as _FullPhotoInfo[];
  };
  await infoReq.send();
  uploadQueue.value?.forEach((item) => {
    item.airport = item.airport_icao_code;
    if (item.airport_iata_code) {
      item.airport += "/" + item.airport_iata_code;
    }
    item.airport += "-" + item.airport_cn;
  });
})();

const deletePhoto = (photoId: number) => {
  const deleteReq = new ServerRequest("DELETE", `/photo/${photoId}`);
  deleteReq.success = () => {
    uploadQueue.value = uploadQueue.value?.filter(
      (item) => item.id !== photoId,
    );
  };
  deleteReq.send();
};

const _ThumbnailUrl = (photo: _FullPhotoInfo) => {
  if (photo.storage_status === "COMPLETE") {
    return ThumbnailUrl(photo.id);
  } else {
    return RawPhotoUrl(photo.id);
  }
};
</script>

<template>
  <div class="upload-photo-list page-box">
    <div>
      <h1>上传队列</h1>
      <p>TOGAPhotos会对您上传的图片进行检查，以确保您的图片符合我们的要求</p>
    </div>
    <div class="upload-photo-box" v-for="photo in uploadQueue">
      <div class="photo">
        <img :src="_ThumbnailUrl(photo)" style="width: 100%; height: auto" />
      </div>
      <div class="info-box">
        <h2>{{ photo.id }}</h2>
        <div class="row">
          <InfoLabel label="注册号" :value="photo.ac_reg" />
          <InfoLabel label="制造商序列号" :value="photo.ac_msn" />
          <InfoLabel label="机型" :value="photo.ac_type" />
          <InfoLabel
            label="航空公司/运营人"
            :value="photo.airline_cn || photo.airline_en"
          />
        </div>
        <div class="row">
          <InfoLabel label="拍摄地点" :value="photo.airport" />
          <InfoLabel
            label="拍摄日期"
            :value="photo.photo_time?.split('T')[0]"
          />
        </div>
        <div class="row">
          <InfoLabel label="备注" :value="photo.user_remark" />
          <InfoLabel label="留言" :value="photo.message" />
        </div>
        <div class="row">
          <InfoLabel label="队列位置" value="0" />
          <el-button
            size="small"
            type="primary"
            @click="OpenToolWindow('cfd', RawPhotoUrl(photo.id))"
          >
            对比度检查
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="OpenToolWindow('histogram', RawPhotoUrl(photo.id))"
          >
            直方图
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="OpenToolWindow('histogramRGB', RawPhotoUrl(photo.id))"
          >
            RGB直方图
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="OpenToolWindow('center', RawPhotoUrl(photo.id))"
          >
            中心检查
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="OpenToolWindow('horizon', RawPhotoUrl(photo.id))"
          >
            水平检查
          </el-button>
          <el-button size="small" type="danger" @click="deletePhoto(photo.id)">
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.upload-photo-box div.value {
  padding-left: 9px;
}
</style>
<style scoped>
.upload-photo-box {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  background-color: rgb(0, 26, 56);
  color: white;
}

.upload-photo-list {
  display: flex;
  flex-direction: column;
  gap: 2vh;
}

.photo {
  display: flex;
  flex: 0 0 40%;
  flex-shrink: 0;
  flex-grow: 1;
  min-width: 200px;
}

@media screen and (min-width: 768px) {
  .photo {
    padding-left: 1em;
  }

  .info-box {
    gap: 1em;
    flex: 0 0 60%;
  }

  .info-label {
    margin-right: 4em;
  }
}

@media screen and (max-width: 767px) {
  .info-box {
    width: 100%;
    gap: 0;
  }

  .row {
    width: 100%;
  }

  .row div {
    margin-right: 1em;
  }
}

.info-box {
  min-width: 200px;
  display: flex;
  padding: 1vh 3vw;
  justify-content: flex-start;
  flex-flow: column wrap;
}

.row {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
}

.info-box .row:last-of-type {
  align-items: end;
}
</style>
