<script setup lang="ts">
import { RemoteSearch } from "@/utils/remoteSearch";

import { onMounted, ref, watch } from "vue";

const value = defineModel({ default: "" });
const loading = ref(false);
const aircraftTypeOptions = ref<{ value: string; label: string }[]>([]);
onMounted(() => _remoteMethod(value.value));

watch(
  () => value.value,
  (newValue) => {
    const localSearch = aircraftTypeOptions.value.filter((obj) => {
      return obj.value === newValue;
    });
    if (localSearch.length > 0) {
      return;
    }
    _remoteMethod(newValue);
  },
);

const _remoteMethod = async (query: string) => {
  if (query.length < 2) {
    return;
  }
  loading.value = true;
  const result = await RemoteSearch.airtype(query);
  loading.value = false;

  if (result.length === 0) {
    aircraftTypeOptions.value = [];
    return;
  }
  aircraftTypeOptions.value = result.map((item) => {
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
