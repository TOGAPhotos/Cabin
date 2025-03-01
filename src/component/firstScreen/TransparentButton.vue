<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isWhite: boolean;
    href?: string;
    isNewPage?: boolean;
  }>(),
  {
    isWhite: false,
    href: '/upload',
    isNewPage: false
  }
);
</script>

<template>
    <a :href="href" :class="['upload-now-btn', { 'white-style': isWhite }]" :target="isNewPage ? '_blank' : ''">
      <slot>立即上传</slot>
    </a>
</template>

<style scoped>
.upload-now-btn {
  width: 8rem;
  height: 2.5rem;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000000;
  font-size: 1rem;
  border: 1px solid #000000;
  border-radius: 2.5rem;
  transition: background-color 0.15s ease, color 0.15s ease;
}
@media (max-width: 768px) {
  .upload-now-btn {
    width: 7rem;
    height: 2.2rem;
    font-size: 0.8rem;
  }
}
@media (max-width: 450px) {
  .upload-now-btn {
    width: 6.5rem;
    height: 2rem;
    font-size: 0.75rem;
  }
}
@media (max-width: 390px) {
  .upload-now-btn {
    width: 6.2rem;
    height: 2rem;
    font-size: 0.75rem;
  }
}
.upload-now-btn:hover {
    background-color: #000000;
    color: #FFFFFF;
    cursor: pointer;
}
.white-style {
  color: #FFFFFF;
  border: 1px solid #FFFFFF;
  background-color: transparent;
}
.white-style:hover {
  color: #000000;
  background-color: #FFFFFF;
}
</style>