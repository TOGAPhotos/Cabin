<script setup lang="ts">
const value = defineModel<PhotoType[]>();
const emits = defineEmits(["airportMode"]);
interface PhotoType {
  label: string;
  value: string;
  class?: string;
}
const photoTypeList: PhotoType[] = [
  { label: "机场", value: "A" },
  { label: "机舱", value: "C" },
  { label: "展品", value: "M" },
  { label: "军机", value: "P", class: "rev-color" },
  { label: "事故", value: "I" },
  { label: "特殊涂装", value: "S", class: "rev-color" },
  { label: "火箭及航天器", value: "R" },
  { label: "非固定翼航空器", value: "O" },
  { label: "滑翔机", value: "G" },
];
</script>
<template>
  <el-checkbox-group v-model="value">
    <el-checkbox
      v-for="type in photoTypeList"
      :label="type.label"
      :value="type.value"
      :class="type?.class"
    />
  </el-checkbox-group>
</template>
<style scoped>
.rev-color {
  padding: 12px;
  background-color: #b1b3b8;
}
</style>
