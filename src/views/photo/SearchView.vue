<script setup lang="ts">
import PhotoCard from "@/components/PhotoCard.vue";
import { BottomLoader } from "@/utils/bottom-loader";
import { RemoteSearch } from "@/utils/remoteSearch";
import type { AcceptPhoto, PhotoSearchType } from "@/utils/type/photo";
import { Loading } from "@element-plus/icons-vue"; // added icon import
import { ElNotification } from "element-plus";
import { onMounted, onUnmounted, reactive, ref, watch } from "vue"; // added onUnmounted
import { useRoute, useRouter } from "vue-router"; // import router

const resultList = ref<AcceptPhoto[]>([]);
const searchInfo = reactive({ type: "reg", content: "" });
const showResult = ref(false);
const searchLoading = ref(false); // loading state used for bottom indicator
const useFuzzySearch = ref(true);
const route = useRoute();
const router = useRouter();
let syncTimer: number | undefined;
let initializing = true;
let syncingFromRoute = false;

const bottomLoader = new BottomLoader(() => search(), 1, 10);

onUnmounted(() => {
  bottomLoader.cancel(); // cleanup scroll listener
  if (syncTimer) window.clearTimeout(syncTimer);
});

onMounted(async () => {
  searchInfo.type = (route.query?.type as string) || "reg";
  searchInfo.content = (route.query?.content as string) || "";

  initializing = false;

  if (searchInfo.content !== "") {
    if (searchInfo.type !== "blurry") {
      useFuzzySearch.value = false;
    }
    await search();
  }
});

function getLastId() {
  if (!resultList.value || resultList.value.length === 0) {
    return -1;
  }
  return resultList.value[resultList.value.length - 1].id;
}

async function NewSearch() {
  if (searchInfo.content === "") {
    return ElNotification.warning("请输入查询内容");
  }
  bottomLoader.reset();
  resultList.value = [];
  return search();
}
watch(
  () => useFuzzySearch.value,
  (val) => {
    if (val) {
      searchInfo.type = "blurry";
      return;
    }
    if (searchInfo.type === "blurry") {
      searchInfo.type = "reg";
      return;
    }
  },
);
async function search() {
  if (searchLoading.value) return;
  if (searchInfo.content === "") {
    return ElNotification.warning("请输入查询内容");
  }
  let lastId = getLastId();
  try {
    searchLoading.value = true;
    if (useFuzzySearch.value) {
      searchInfo.type = "blurry";
    }
    const result = await RemoteSearch.photo(
      <PhotoSearchType>searchInfo.type,
      searchInfo.content,
      lastId,
    );
    if (result.length === 0) {
      bottomLoader.cancel();
    }
    resultList.value = resultList.value.concat(result);
    showResult.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    searchLoading.value = false;
  }
}

// 监听 searchInfo 变化同步到 URL 查询参数（防抖 + replace 不刷新页面）
watch(
  () => ({ type: searchInfo.type, content: searchInfo.content }),
  (val, old) => {
    if (initializing || syncingFromRoute) return; // 初始化阶段或来自路由的更新不写入
    // 如果未变化则跳过
    if (val.type === old.type && val.content === old.content) return;
    if (syncTimer) window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(() => {
      const newQuery: Record<string, any> = { ...route.query };
      // 内容为空时移除参数，保持 URL 简洁
      if (val.content) newQuery.content = val.content;
      else delete newQuery.content;
      // 模糊搜索时始终写 blurry，否则写具体类型
      newQuery.type = val.type;
      router.replace({ query: newQuery }).catch(() => {}); // 忽略重复导航错误
    }, 300); // 300ms 防抖
  },
  { deep: true },
);

// 新增：监听路由 query 变化 -> 回写到本地状态，实现浏览器前进/后退时的同步
watch(
  () => route.query,
  (q) => {
    if (initializing) return; // 初始化前不处理
    syncingFromRoute = true;
    const newType = (q?.type as string) || "reg";
    const newContent = (q?.content as string) || "";
    const typeChanged = searchInfo.type !== newType;
    const contentChanged = searchInfo.content !== newContent;

    if (typeChanged) searchInfo.type = newType;
    if (contentChanged) searchInfo.content = newContent;

    // 根据类型决定是否处于模糊搜索 UI
    if (searchInfo.type === "blurry") {
      if (!useFuzzySearch.value) useFuzzySearch.value = true;
    } else {
      if (useFuzzySearch.value && searchInfo.type !== "blurry")
        useFuzzySearch.value = false;
    }
    if (typeChanged || contentChanged) {
      NewSearch();
    }
    syncingFromRoute = false;
  },
  { deep: true },
);

const searchOptions = [
  {
    value: "reg",
    label: "注册号",
  },
  {
    value: "airline",
    label: "航司",
  },
  {
    value: "airtype",
    label: "机型",
  },
  {
    value: "airport",
    label: "机场",
  },
  {
    value: "user",
    label: "摄影师",
  },
];
</script>

<template>
  <div class="search-view page-box">
    <div v-if="useFuzzySearch" class="search-box">
      <el-input
        class="input"
        v-model="searchInfo.content"
        placeholder="请输入搜索内容"
        @keyup.enter="NewSearch"
      />
      <el-button class="search-button" type="primary" @click="NewSearch"
        >搜索</el-button
      >
    </div>
    <div v-else class="search-box">
      <el-select class="selector" v-model="searchInfo.type">
        <el-option
          v-for="item in searchOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        class="input"
        v-model="searchInfo.content"
        @keyup.enter="NewSearch()"
      />
      <el-button class="search-button" type="primary" @click="NewSearch()"
        >搜索</el-button
      >
    </div>
    <div v-if="useFuzzySearch" style="display: flex; justify-content: center">
      <el-button
        type="text"
        class="search-button"
        @click="useFuzzySearch = false"
        >高级搜索&rAarr;</el-button
      >
    </div>
    <div v-else style="display: flex; justify-content: center">
      <el-button
        type="text"
        class="search-button"
        @click="useFuzzySearch = true"
        >&lAarr;返回普通搜索</el-button
      >
    </div>
    <div class="global-container flex flex-col gap-8">
      <div class="content-box-title" v-if="showResult">
        <h2>搜索结果</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <PhotoCard
          v-for="photo in resultList"
          v-bind="{ ...photo, showAirport: true }"
          :key="photo.id"
        />
      </div>
      <!-- bottom-only loading indicator -->
      <div v-if="searchLoading" class="bottom-loader">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span class="loading-text">正在加载中...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-box {
  padding-top: 3rem;
  display: flex;
  justify-content: center;
}

.selector {
  width: 8em;
}

.input {
  width: 20em;
}

.search-button,
.input {
  margin-left: 1vw;
}
.bottom-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0 2rem 0;
  color: #666;
  font-size: 0.95rem;
}
.loading-text {
  margin-left: 0.5rem;
}
</style>
