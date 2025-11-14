<template>
  <footer
    class="flex flex-col items-center gap-3 text-text-secondary pt-6 py-6"
  >
    <div class="flex gap-4 text-sm font-bold underline">
      <a v-for="link in links" :key="link.href" :href="link.href">
        {{ link.label }}
      </a>
    </div>

    <div class="flex flex-col items-center text-xs font-extrabold">
      <div>Maintenance by TOGAPhotos Team</div>
      <div>Copyright © 2023-Present TOGAPhotos All Rights Reserved.</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const links = [
  { href: "/privacy", label: "隐私政策" },
  { href: "/tos", label: "用户协议" },
];
</script>
