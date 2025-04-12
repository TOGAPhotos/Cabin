<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import ServerRequest from "@/utils/request";
import { ElMessage } from "element-plus";

const value = defineModel<number | undefined>() as Ref<number | undefined>;

const airportOptionsList = ref([
  {
    label: "搜索结果",
    options: [],
  },
  {
    label: "特殊情况",
    options: [{ value: 26, label: "在航班上" }],
  },
]);
const loading = ref(false);

const getAirportById = async (id: number) => {
  const airportReq = new ServerRequest("GET", `/airport/${id}`);
  airportReq.success = () => {
    const airport = airportReq.getData();
    airportOptionsList.value[0].options = [
      { label: airport["airport_cn"], value: airport["id"] },
    ];
  };
  await airportReq.send();
};

onMounted(async () => {
  if (!value.value) {
    return;
  }
  await getAirportById(value.value);
});

const airportRemoteSearch = async (query: string) => {
  if (!query || query.length < 2) {
    return;
  }

  const searchReq = new ServerRequest("GET", `/airport?search=${query}`);
  searchReq.success = () => {
    loading.value = true;
    airportOptionsList.value[0].options = searchReq
      .getData()
      .map((item: any) => {
        return {
          label: item["airport_cn"],
          value: item["id"],
        };
      });
    loading.value = false;
  };
  searchReq.error = () => {
    ElMessage.error("搜索出错");
    loading.value = false;
  };
  await searchReq.send();
};
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

<style scoped></style>
