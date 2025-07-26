<script setup lang="ts">
import { ElNotification } from "element-plus";
import { onMounted } from "vue";

import ServerRequest from "@/utils/request";

import HomeBanner from "@/component/homepage/HomeBanner.vue";
import HomeIntro from "@/component/homepage/HomeIntro.vue";
import NewPhotos from "@/component/homepage/NewPhotos.vue";
import useUserInfoStore from "@/stores/userInfo";

const user = useUserInfoStore();

const notamReq = new ServerRequest("GET", "/notam");
notamReq.success = () => {
  const notam = {
    title: notamReq.getData("title"),
    id: notamReq.getData("id"),
    content: notamReq.getData("content"),
  };
  if (notam.title === "NOTAM CLSD" || notam.id === user.notam) {
    return;
  }
  ElNotification({
    title: notam.title,
    message: notam.content,
    offset: 64,
    duration: 5000,
    onClose: () => (user.notam = notam.id),
  });
};

onMounted(() => {
  Promise.allSettled([notamReq.send()]);
});
</script>
<template>
  <div class="flex flex-col gap-16">
    <HomeBanner :isLogged="user.isLoggedIn" />
    <HomeIntro />
    <NewPhotos />
  </div>
</template>
