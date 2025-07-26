<script setup lang="ts">
import HeadBar from "@/component/header/HeadBar.vue";
import { RouterView } from "vue-router";

import Footer from "@/component/Footer.vue";
import { computed } from "vue";

const showHeadBar = computed(() => {
  const NO_SHOW_PATH = ["/maintenance"];
  return !NO_SHOW_PATH.includes(window.location.pathname);
});
</script>

<template>
  <HeadBar v-if="showHeadBar" />
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

/* .main{
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 24px 15px;
} */
</style>
