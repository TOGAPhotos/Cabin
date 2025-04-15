<script setup lang="ts">
import Device from "@/utils/device";
import ServerRequest from "@/utils/request";
import { ElMessage, type FormInstance } from "element-plus";
import { computed, reactive, useTemplateRef } from "vue";

const show = defineModel({ type: Boolean, default: false });
const status = reactive({
  loading: false,
});

const form = useTemplateRef<FormInstance>("form");
const formData = reactive({
  airline_cn: "",
  airline_en: "",
  icao_code: "",
  iata_code: "",
});
const setWidth = computed(() => (Device.isPhone() ? "100%" : 500));

async function submit() {
  if (status.loading) return;

  if (formData.airline_en === "" && formData.airline_cn === "") {
    ElMessage.error("航司名称不能全部留空");
    return;
  }
  // if(form.icao_code === ""){
  //   ElMessage.error("ICAO 不能为空");
  //   return;
  // }

  status.loading = true;
  const req = new ServerRequest("POST", "/airline", formData);
  req.success = (msg) => {
    ElMessage.success(msg);
    form.value!.resetFields();
    show.value = false;
  };
  req.error = (code, msg) => {
    ElMessage.error(msg);
  };
  await req.send();
  status.loading = false;
}
</script>

<template>
  <el-drawer
    v-model="show"
    title="添加航司/运营人"
    :size="setWidth"
    direction="ltr"
  >
    <div>
      <h3 style="margin-bottom: 0.8rem">填写说明</h3>
      <p>如航司无官方中文名称，则中文名称可留空。</p>
    </div>
    <el-divider />
    <el-form label-position="top" ref="form" :model="formData">
      <el-form-item label="中文名" prop="airline_cn">
        <el-input
          v-model="formData.airline_cn"
          placeholder="例：中国国际航空"
        />
      </el-form-item>
      <el-form-item label="英文名" prop="airline_en">
        <el-input v-model="formData.airline_en" placeholder="例：Air China" />
      </el-form-item>
      <el-form-item label="ICAO代码" prop="icao_code">
        <el-input v-model="formData.icao_code" placeholder="例：CCA" />
      </el-form-item>
      <el-form-item label="IATA代码" prop="iata_code">
        <el-input v-model="formData.iata_code" placeholder="例：CA" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="show = false">取消</el-button>
        <el-button
          type="primary"
          @click="submit()"
          v-loading="status.loading"
          :disabled="status.loading"
          >确认</el-button
        >
      </div>
    </template>
  </el-drawer>
</template>

<style scoped></style>
