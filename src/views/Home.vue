<script setup lang="ts">
import EditorChoiceComponent from "@/component/homepage/EditorChoiceComponent.vue";
import HomeBanner from "@/component/homepage/HomeBanner.vue";
import HomeIntro from "@/component/homepage/HomeIntro.vue";
import NewPhotos from "@/component/homepage/NewPhotos.vue";

import NotamDialog from "@/component/homepage/NotamDialog.vue";
</script>
<template>
  <div class="flex flex-col gap-16">
    <HomeBanner />
    <HomeIntro />
    <EditorChoiceComponent />
    <NewPhotos />
    <NotamDialog />
  </div>
</template>
