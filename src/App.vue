<script setup lang="ts">
import HeadBar from "@/component/header/HeadBar.vue";
import { RouterView, useRoute } from "vue-router";

import Footer from "@/component/Footer.vue";
import { computed } from "vue";

const route = useRoute();
const showHeadBar = computed(
  () => !route.matched.some((r) => r.meta?.hideHeader),
);
</script>

<template>
  <HeadBar v-show="showHeadBar" />
  <main class="pt-16">
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped>
main {
  min-height: calc(100dvh - 170px);
  margin: 0 auto;
}
</style>
