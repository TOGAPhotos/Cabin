<script setup lang="ts">
import serverRequest from "@/utils/request";
import {ElMessage, type ListItem} from "element-plus";
import {ref} from "vue";

const value = defineModel({type: Number})
const loading = ref(false)
const aircraftTypeOptions = ref<ListItem[]>([])

const aircraftTypeRemoteSearch = async (query: string) => {

  if ((!query) || query.length < 2) {
    return
  }

  const searchReq = new serverRequest('GET', `/aircraftType/${query}`)
  searchReq.success = () => {
    loading.value = true;
    aircraftTypeOptions.value = searchReq.getData('aircraftType').map(
        (item: any) => {
          return {
            label: item['aircraft_type'] ,
            value: item['id']
          }
        })
    loading.value = false;
  }
  searchReq.error = () => {
    ElMessage.error('搜索出错')
    loading.value = false;
  }
  await searchReq.send();
}

</script>

<template>
<el-select v-model="value"
           filterable
           remote
           reserve-keyword
           placeholder="请输入关键词进行搜索"
           :remote-method="aircraftTypeRemoteSearch"
           :loading="loading">
  <el-option v-for="option in aircraftTypeOptions"
             :key="option.value"
             :label="option.label"
             :value="option.value"/>
</el-select>
</template>

<style scoped>

</style>