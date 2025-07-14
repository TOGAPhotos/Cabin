<script setup lang="ts">
import HomeBanner from "@/component/firstScreen/HomeBanner.vue";
import { ElNotification } from "element-plus";
import { onMounted } from "vue";

import ServerRequest from "@/utils/request";

import StatisticInfoBox from "@/component/firstScreen/StatisticInfoBox.vue";
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
  <div>
    <HomeBanner :user="user" />
    <StatisticInfoBox />
    <!--    <NewPhotos />-->
  </div>
</template>
