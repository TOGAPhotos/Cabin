<script setup lang="ts">

import {onMounted, reactive, ref, watch} from "vue";
import Thumbnail from "@/components/Thumbnail.vue";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import router from "@/router";
import {RemoteSearch,} from "@/utils/remoteSearch";
import {BottomLoader} from "@/utils/bottom-loader";
import type { AcceptPhoto,PhotoSearchType } from "@/utils/type/photo";

const resultList = ref<AcceptPhoto[]>([]);
const searchInfo = reactive({type: "reg", content: ''});
const showResult = ref(false);
const searchLoading = ref(false);
const useFuzzySearch = ref(true);
const route = useRoute()

watch( ()=> route.path, ()=> router.go(0))

onMounted(async () => {
  searchInfo.type = route.query?.type as string || 'reg'
  searchInfo.content = route.query?.content as string || ''

  if(searchInfo.content !== '') {
    if(searchInfo.type !== 'blurry'){
      useFuzzySearch.value = false
    }
    await search()
  }

})

function getLastId(){
  if(!resultList.value || resultList.value.length === 0){
    return -1;
  }
  return resultList.value[resultList.value.length-1].id
}

async function NewSearch() {
  if (searchInfo.content === '') {
    return ElMessage.warning('请输入查询内容')
  }
  // await router.push({path:'/search', query:{content:searchInfo.content, type:searchInfo.type}})
  resultList.value = []
  return search();
}
watch(()=>useFuzzySearch.value,(val)=>{
  if(val){
    searchInfo.type = 'blurry'
  }else{
    searchInfo.type = 'reg'
  }
})
async function search() {
  let lastId = getLastId()

  try{
    searchLoading.value = true;
    if(useFuzzySearch.value){
      searchInfo.type = 'blurry'
    }
    const result = await RemoteSearch.photo(<PhotoSearchType>searchInfo.type, searchInfo.content, lastId);
    resultList.value = resultList.value.concat(result);
    console.log(resultList.value, result)
    showResult.value = true;
  }catch(error){
    console.log(error);
  }finally {
    searchLoading.value = false;
  }

}

const bottomLoader = new BottomLoader(() => search())

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
  <div class="search-view page-box">
    <div v-if="useFuzzySearch" class="search-box">
      <el-input class="input" v-model="searchInfo.content" placeholder="请输入搜索内容" @keyup.enter="NewSearch"/>
      <el-button class="search-button" type="primary" @click="NewSearch">搜索</el-button>
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
      <el-input class="input" v-model="searchInfo.content" @keyup.enter="NewSearch()"/>
      <el-button class="search-button" type="primary" @click="NewSearch()">搜索</el-button>
    </div>
    <div v-if="useFuzzySearch" style="display:flex; justify-content: center;">
      <el-button type="text" class="search-button" @click="useFuzzySearch = false">高级搜索&rAarr;</el-button>
    </div>
    <div v-else style="display:flex; justify-content: center;">
      <el-button type="text" class="search-button" @click="useFuzzySearch = true">&lAarr;返回普通搜索</el-button>
    </div>
    <div class="content-box" v-loading="searchLoading">
      <div class="content-box-title" v-if="showResult">
        <h2>搜索结果</h2>
      </div>
      <div class="content-box-main">
        <Thumbnail v-for="photo in resultList" :key="photo.id"
                   :id="photo.id"
                   :reg="photo.ac_reg"
                   :airline="photo.airline_cn"
                   :username="photo.username"
                   :airType="photo.ac_type"
                   :airport="{
                     name: photo.airport_cn,
                     icao: photo.airport_icao_code,
                     iata: photo.airport_iata_code
                   }"
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

.search-button, .input {
  margin-left: 1vw;
}
.content-box{
  margin: 12px 0 0 0;
}
</style>