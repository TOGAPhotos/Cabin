<script setup lang="ts">
import ServerRequest from "@/utils/request";
import {ElMessage} from "element-plus";
import {ref,watch} from "vue";
import type {Option} from "@/utils/type/option";

const value = defineModel({type: Number})
const loading = ref(false)
const airlineOptions = ref<Option[]>([])

const airlineRemoteSearch = async (query: string) => {

  if ((!query) || query.length < 2) {
    return
  }

  const searchReq = new ServerRequest('GET', `/airline?search=${query}`)
  searchReq.success = () => {
    loading.value = true;
    airlineOptions.value = searchReq.getData().map(
        (item: any) => {
          return {
            label: item['airline_cn'] || item['airline_en'],
            value: item['id']
          }
        })
  }
  searchReq.error = () => {
    ElMessage.error('搜索出错')
  }
  await searchReq.send();
  loading.value = false;
}

watch(()=>value.value, async (newValue)=>{
  if(!newValue) return;
  const optionSearch = airlineOptions.value.find((item)=>item.value === newValue)
  if(optionSearch) return;
  const searchReq = new ServerRequest('GET', `/airline/${newValue}`)
  searchReq.success = () => {
    airlineOptions.value.push({
      label: searchReq.getData()['airline_cn'] || searchReq.getData()['airline_en'],
      value: searchReq.getData()['id']
    })
  }
  await searchReq.send();
})

</script>

<template>
<el-select v-model="value"
           filterable
           remote
           reserve-keyword
           placeholder="请输入关键词进行搜索"
           :remote-method="airlineRemoteSearch"
           :loading="loading">
  <el-option v-for="option in airlineOptions"
             :key="option.value"
             :label="option.label"
             :value="option.value"/>
</el-select>
</template>

<style scoped>

</style>