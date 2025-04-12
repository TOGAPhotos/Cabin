<script setup lang="ts">
import { RemoteSearch } from "@/utils/remoteSearch";

import { onMounted, ref } from "vue";

const value = defineModel({ default: "" });
const loading = ref(false);
const aircraftTypeOptions = ref<{ value: string; label: string }[]>([]);
onMounted(() => _remoteMethod(value.value));

const _remoteMethod = async (query: string) => {
  if (query.length < 2) {
    return;
  }
  loading.value = true;
  const resutl = await RemoteSearch.airtype(query);
  loading.value = false;

  if (resutl.length === 0) {
    aircraftTypeOptions.value = [];
    return;
  }
  aircraftTypeOptions.value = resutl.map((item) => {
    return {
      value: item.sub_type,
      label: `${item.manufacturer_cn}/${item.sub_type}`,
    };
  });
};
</script>

<template>
  <el-select
    v-model="value"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词进行搜索"
    :remote-method="_remoteMethod"
    :loading="loading"
  >
    <el-option
      v-for="option in aircraftTypeOptions"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<style scoped></style>
