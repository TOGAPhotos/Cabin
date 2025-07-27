<script setup lang="ts">
import PhotoCard from "@/components/PhotoCard.vue";
import router from "@/router";
import { BottomLoader } from "@/utils/bottom-loader";
import { RemoteSearch } from "@/utils/remoteSearch";
import type { AcceptPhoto, PhotoSearchType } from "@/utils/type/photo";
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

const resultList = ref<AcceptPhoto[]>([]);
const searchInfo = reactive({ type: "reg", content: "" });
const showResult = ref(false);
const searchLoading = ref(false);
const useFuzzySearch = ref(true);
const route = useRoute();

watch(
  () => route.path,
  () => router.go(0),
);

onMounted(async () => {
  searchInfo.type = (route.query?.type as string) || "reg";
  searchInfo.content = (route.query?.content as string) || "";

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
    return ElMessage.warning("请输入查询内容");
  }
  // await router.push({path:'/search', query:{content:searchInfo.content, type:searchInfo.type}})
  resultList.value = [];
  return search();
}
watch(
  () => useFuzzySearch.value,
  (val) => {
    if (val) {
      searchInfo.type = "blurry";
    } else {
      searchInfo.type = (route.query?.type as string) || "reg";
    }
  },
);
async function search() {
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
    resultList.value = resultList.value.concat(result);
    console.log(resultList.value, result);
    showResult.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    searchLoading.value = false;
  }
}

const bottomLoader = new BottomLoader(() => search());

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
    <div class="global-container flex flex-col gap-8" v-loading="searchLoading">
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
.content-box {
  margin: 12px 0 0 0;
}
</style>
