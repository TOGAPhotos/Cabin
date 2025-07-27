<script setup lang="ts">
import router from "@/router";
import { Search } from "@element-plus/icons-vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

const inputContent = ref("");
const showMobileSearchBox = ref(false);
const mobileSearchButton = ref<HTMLElement | null>(null);
const mobileSearchBox = ref<HTMLElement | null>(null);

const props = withDefaults(
  defineProps<{
    isFocus?: boolean;
    isMobile?: boolean;
  }>(),
  {
    isFocus: false,
    isMobile: false,
  },
);

const handleClickOutside = (event: MouseEvent) => {
  if (
    mobileSearchBox.value &&
    mobileSearchButton.value &&
    showMobileSearchBox.value &&
    !mobileSearchButton.value.contains(event.target as Node) &&
    !mobileSearchBox.value.contains(event.target as Node)
  ) {
    showMobileSearchBox.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const search = () => {
  return router.push({
    path: "/search",
    query: { content: inputContent.value, type: "blurry" },
  });
};
</script>

<template>
  <div
    v-if="!isMobile"
    class="input-box"
    :class="!isFocus && inputContent === '' ? 'blur' : ''"
  >
    <el-input
      v-model="inputContent"
      style="max-width: 600px"
      placeholder="搜索注册号、机型、机场、摄影师等信息"
      class="input-with-select"
    >
      <template #append>
        <el-button :icon="Search" @click="search" />
      </template>
    </el-input>
  </div>
  <div v-else>
    <div
      class="mobile-search-btn"
      @click="showMobileSearchBox = !showMobileSearchBox"
      ref="mobileSearchButton"
    >
      <el-icon class="search-icon"><Search /></el-icon>
    </div>
    <div
      v-show="showMobileSearchBox"
      class="mobile-input-container"
      ref="mobileSearchBox"
    >
      <el-input
        v-model="inputContent"
        placeholder="搜索注册号、机型、机场、摄影师等信息"
        class="input-with-select mobile-input"
      >
        <template #append>
          <el-button :icon="Search" @click="search" />
        </template>
      </el-input>
    </div>
  </div>
</template>

<style scoped>
.input-box {
  max-width: 23rem;
  width: 100%;
  transition: opacity 0.3s ease;
}
.blur {
  opacity: 0.2;
}
.mobile-search-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-icon {
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
}
.mobile-input-container {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100vw;
  height: 64px;
  padding: 0 15px;
  background-color: #001a38;
  z-index: 100;
}
.mobile-input {
  width: 100%;
}
</style>
