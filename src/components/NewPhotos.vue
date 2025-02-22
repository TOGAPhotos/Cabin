<script setup lang="ts">
import {onMounted, ref, inject, type Ref} from "vue";
import serverRequest from "@/utils/request";

// import Thumbnail from "@/components/Thumbnail.vue";
import PhotoBox from "@/components/photo/PhotoBox.vue";

const screenWidth = inject("screenWidth") as Ref<number>;

const photoList = ref<PhotoInfo[]>([]);
const photoListReq = new serverRequest('GET', "/photos/full?lastId=-1");
photoListReq.success = () => photoList.value = photoListReq.getData('data')

onMounted(() => {
    Promise.allSettled([
      photoListReq.send(),
    //   notamReq.send(),
    ]).then(()=>{
        console.log(photoList.value)
    })
})
</script>

<template>
    <div class="content-box newphotos-box">
      <div class="content-box-title">
        <h2>最新图片</h2>
      </div>
      <div class="content-box-main newphotos-photolist">
        <div class="photobox" v-for="photo in photoList" :key="photo.id">
            <PhotoBox :photoInfo="photo" :isMobile="screenWidth >= 1024 ? false : true" />
        </div>
        
        <!-- <Thumbnail v-for="photo in photoList" :key="photo.id"
                   :id="photo.id"
                   :reg="photo.reg"
                   :airline="photo.airline"
                   :username="photo.username"
                   :airType="photo.airtype"
        /> -->
      </div>
    </div>
</template>

<style scoped>
.newphotos-box{
    /* background-color: red; */
}
.newphotos-photolist{
    /* background-color: pink; */
    padding: 2rem 0rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}
.newphotos-photolist .photobox{
    width: 100%;
    max-width: 18.5rem;
}
@media only screen and (max-width: 1023px) {
    .newphotos-photolist .photobox{
        /* width: 100%; */
        /* max-width: 25rem; */
        flex: 1 1 45%;
        min-width: 30%;
    }
}
</style>