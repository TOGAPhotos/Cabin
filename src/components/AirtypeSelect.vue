<script setup lang="ts">
import { ref } from "vue";
import ServerRequest from "@/utils/request";
import type {Option} from "@/utils/type/option";
import type {Airtype} from "@/utils/type/airtype";



const value = defineModel({type:String})
const airTypeOptions = ref<Option[]>();


async function searchAirtype(query:string) {
  if(query.length < 2){
    return;
  }
  const search = new ServerRequest('GET', `/airtypes?search=${query}`)
  search.success = ()=>{}
  await search.send()

  airTypeOptions.value = search.getData().map((obj:Airtype) =>{
    return {
      label: `${obj['manufacturer_cn']} / ${obj['sub_type']}`,
      value: obj['sub_type'],
    }
  })
}

</script>
<template>
  <el-select
      v-model="value"
      filterable
      remote
      reserve-keyword
      :remote-method="searchAirtype"
      placeholder="请输入关键词进行搜索"
  >
    <el-option
        v-for="item in airTypeOptions"
        :label="item.label"
        :value="item.value"
    />
  </el-select>
</template>