<script setup lang="ts">
import Device from "@/utils/device";
import ServerRequest from "@/utils/request";
import { ElMessage, type FormInstance } from "element-plus";
import { computed, reactive, useTemplateRef } from "vue";

const show = defineModel({ type: Boolean, default: false });
const status = reactive({
  nonCode: false,
  loading: false,
});
function nonCodeMode() {
  status.nonCode = !status.nonCode;
  formData.icao_code = status.nonCode ? "OTHER" : "";
}
const form = useTemplateRef<FormInstance>("form");
const formData = reactive({
  airport_cn: "",
  airport_en: "",
  icao_code: "",
  iata_code: "",
});
const setWidth = computed(() => (Device.isPhone() ? "100%" : 500));

async function submit() {
  if (status.loading) return;

  if (formData.airport_cn === "" && formData.airport_en === "") {
    ElMessage.error("名称不能为空");
    return;
  }
  if (formData.icao_code === "") {
    ElMessage.error("ICAO 不能为空");
    return;
  }
  status.loading = true;
  const req = new ServerRequest("POST", "/airport", formData);
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
    title="添加机场"
    :size="setWidth"
    direction="ltr"
    ref="form"
  >
    <div>
      <h3 style="margin-bottom: 0.8rem">填写说明</h3>
      <p></p>
      <p>如机场没无ICAO代码，请使用无代码地点。</p>
      <p>中文名称和英文名称至少填写一个。</p>
    </div>
    <el-divider />
    <el-form label-position="top" ref="form" :model="formData">
      <el-form-item label="中文名" prop="airport_cn">
        <el-input
          v-model="formData.airport_cn"
          placeholder="例：北京首都国际机场"
        />
      </el-form-item>
      <el-form-item label="英文名" prop="airport_en">
        <el-input
          v-model="formData.airport_en"
          placeholder="例：Beijing Capital Internation Airport"
        />
      </el-form-item>
      <el-form-item label="ICAO代码" prop="icao_code">
        <el-input
          v-model="formData.icao_code"
          :disabled="status.nonCode"
          placeholder="例：ZBAA"
        />
      </el-form-item>
      <el-form-item label="IATA代码" prop="iata_code">
        <el-input
          v-model="formData.iata_code"
          :disabled="status.nonCode"
          placeholder="例：PEK"
        />
      </el-form-item>
      <el-button v-if="!status.nonCode" @click="nonCodeMode"
        >无代码地点</el-button
      >
      <el-button v-else @click="nonCodeMode">有代码地点</el-button>
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
