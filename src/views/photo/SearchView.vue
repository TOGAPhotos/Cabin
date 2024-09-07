<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import Thumbnail from "@/components/Thumbnail.vue";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import router from "@/router";
import {RemoteSearch,} from "@/utils/remoteSearch";
import {BottomLoader} from "@/utils/bottomLoader";
import type {PhotoSearchResult, SearchType} from "@/utils/type/remoteSearch";

enum FUNC_CALL{
  FIRST,
  CONTINUE
}

const resultList = ref<PhotoSearchResult[]>();
const searchInfo = reactive({type: "reg", content: ''});
const showResult = ref(false);
const searchLoading = ref(false);

onMounted(async () => {
  const route = useRoute()
  searchInfo.type = route.query?.type as string || 'reg'
  searchInfo.content = route.query?.ctx as string || ''
  if(searchInfo.content !== '') {
    await search(FUNC_CALL.FIRST)
  }

})

function getLastId(){
  if(!resultList.value || resultList.value.length === 0){
    return -1;
  }
  return resultList.value[resultList.value.length-1].id
}

async function search(callType:number) {
  if (searchInfo.content === '') {
    return ElMessage.warning('请输入查询内容')
  }

  let lastId = -1;
  if(callType === FUNC_CALL.CONTINUE){
    lastId = getLastId();
  }

  searchLoading.value = true;

  try{
    const result = await RemoteSearch.photo(searchInfo.type as SearchType, searchInfo.content, lastId);
    if(lastId === -1){
      resultList.value = result;
    }else{
      resultList.value = resultList.value?.concat(result)
    }
    router.push(`/search?content=${searchInfo.content}&type=${searchInfo.type}`)
    showResult.value = true;
  }catch(error){
    console.log(error);
  }finally {
    searchLoading.value = false;
  }

}

const bottomLoader = new BottomLoader(() => search(FUNC_CALL.CONTINUE))

const searchOptions = [
  {
    value: 'reg',
    label: '注册号'
  },
  {
    value: 'airline',
    label: '航司'
  },
  {
    value: 'airtype',
    label: '机型'
  },
  {
    value: 'airport',
    label: '机场'
  },
  {
    value: 'user',
    label:'摄影师'
  }
]

</script>

<template>
  <div class="search-view">
    <div class="search-box">
      <el-select class="selector" v-model="searchInfo.type">
        <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"

        />
      </el-select>
      <el-input class="input" v-model="searchInfo.content"/>
      <el-button id="search-button" type="primary" @click="search(FUNC_CALL.FIRST)">搜索</el-button>
    </div>
    <div class="content-box" v-loading="searchLoading">
      <div class="content-box-title" v-if="showResult">
        <h2>搜索结果</h2>
      </div>
      <div class="content-box-main">
        <Thumbnail v-for="photo in resultList" :key="photo.id"
                   :id="photo.id"
                   :reg="photo.ac_reg"
                   :airline="photo.airline"
                   :username="photo.username"
                   :airType="photo.ac_type"
                   :airport="{
                     name: photo.cn_name,
                     icao: photo.icao,
                     iata: photo.iata
                   }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-box {
  display: flex;
  justify-content: center;
}

.selector {
  width: 8em;
}

.input {
  width: 20em;
}

#search-button, .input {
  margin-left: 1vw;
}
.content-box{
  margin: 12px 0 0 0;
}
</style>