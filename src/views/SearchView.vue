<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import Thumbnail from "@/components/Thumbnail.vue";
import {useRoute} from "vue-router";
import serverRequest from "@/utils/request";
import {ElMessage} from "element-plus";
import router from "@/router";
interface SearchResult extends PhotoInfo  {
  cn_name: string;
  iata: string;
  icao:string;
}

const resultList = ref<SearchResult[]>();

let lastId = -1;
const searchInfo = reactive({type: "reg", content: ''});

async function search() {
  if (searchInfo.content === '') {
    return ElMessage.warning('请输入查询内容')
  }
  const searchUrl = `/search?keyword=${searchInfo.content}&type=${searchInfo.type}&lastId=${lastId}`
  const searchReq = new serverRequest('GET', searchUrl)
  searchReq.success = () => {
    if(lastId === -1){
      resultList.value = searchReq.getData('data')
    }else{
      resultList.value = resultList.value?.concat(searchReq.getData('data'))
    }
    router.push(`/search?content=${searchInfo.content}&type=${searchInfo.type}`)
  }
  await searchReq.start();
}

const route = useRoute()
onMounted(async () => {
  searchInfo.type = route.query?.type as string || 'reg'
  searchInfo.content = route.query?.content as string || ''
  if(searchInfo.content !== '') {
    await search()
  }
})

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
      <el-button id="search-button" type="primary" @click="search()">搜索</el-button>
    </div>
    <div class="content-box">
      <div class="content-box-title">
        <h2>搜索结果</h2>
      </div>
      <div class="content-box-main">
        <Thumbnail v-for="photo in resultList" :key="photo.id"
                   :id="photo.id"
                   :reg="photo.reg"
                   :airline="photo.airline"
                   :username="photo.username"
                   :airType="photo.airtype"
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