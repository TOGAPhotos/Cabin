<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeadBar from '@/components/header/HeadBar.vue'

import Footer from '@/components/Footer.vue'
</script>

<template>
  <HeadBar />
  <main>
    <RouterView class="main"/>
  </main>
  <Footer />
</template>

<style scoped>
main{
  min-height: calc(100vh - 170px);
}
.main{
  /* max-width: var(--max-width); */
  margin: 0 auto;
  /* padding: 24px 15px; */
}
</style>