<script setup lang="ts">
import {onMounted, ref} from "vue";
import serverRequest from "@/utils/request";
import {ElMessage} from "element-plus";

const value = defineModel({type: Number})

const airportOptionsList = ref([
  {
    label: "搜索结果",
    options: []
  },
  {
    label: '特殊情况',
    options: [
      {value: 26, label: '在航班上'},
    ]
  },
])
const loading = ref(false);

onMounted(async ()=>{
  if(!value.value){
    return;
  }
  const airportReq = new serverRequest('GET', `/airport?search=${value.value}`)
  airportReq.success = () =>{
    const airport = airportReq.getData('airport')
    airportOptionsList.value[0].options=[{label: airport["cn_name"],value: airport["id"]}]
  }
  await airportReq.start();
})

const airportRemoteSearch = async (query: string) => {

  if ((!query) || query.length < 2) {
    return
  }

  const searchReq = new serverRequest('GET', `/airports?search=${query}`)
  searchReq.success = () => {
    loading.value = true;
    airportOptionsList.value[0].options = searchReq.getData('airport').map(
        (item: any) => {
          return {
            label: item['cn_name'],
            value: item['id']
          }
        })
    loading.value = false;
  }
  searchReq.error = () => {
    ElMessage.error('搜索出错')
    loading.value = false;
  }
  await searchReq.start();

}

</script>

<template>
  <el-select
      v-model="value"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词进行搜索"
      :remote-method="airportRemoteSearch"
      :loading="loading"
  >
    <el-option-group
        v-for="group in airportOptionsList"
        :key="group.label"
        :label="group.label"
    >
      <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-option-group>
  </el-select>
</template>

<style scoped>

</style>