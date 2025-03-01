<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import Device from "@/utils/device";
import {ElMessage} from "element-plus";
import ServerRequest from "@/utils/request";

const show = defineModel({type:Boolean,default:false});
const status = reactive({
  nonCode: false,
  loading: false,
})
function nonCodeMode(){
  status.nonCode = !status.nonCode;
  form.icao_code = status.nonCode ? "OTHER" : "";
}

const form = reactive({
  airport_cn:"",
  airport_en:"",
  icao_code:"",
  iata_code:"",
});
const setWidth = computed(()=> Device.isPhone() ? '100%' : 500)

async function submit(){
  if(status.loading) return;

  if(form.airport_cn === ""){
    ElMessage.error("中文名不能为空");
    return;
  }
  if(form.icao_code === ""){
    ElMessage.error("ICAO 不能为空");
    return;
  }
  status.loading=true;
  const req = new ServerRequest("POST","/airport",form);
  req.success = (msg) => {
    ElMessage.success(msg);
    show.value = false;
  }
  req.error = (code,msg) => {
    ElMessage.error(msg)
  };
  await req.send()
  status.loading = false;
}
</script>

<template>
  <el-drawer
      v-model="show" title="添加机场"
      :size="setWidth" direction="ltr"
  >
    <div>
      <h3 style="margin-bottom: 0.8rem">填写说明</h3>
      <p></p>
      <p>如机场没无ICAO代码，请使用无代码地点。</p>
      <p>英文名称为选填。</p>
    </div>
    <el-divider/>
    <el-form
        label-position="top"
    >
      <el-form-item label="中文名">
        <el-input v-model="form.airport_cn" placeholder="例：北京首都国际机场"/>
      </el-form-item>
      <el-form-item label="英文名">
        <el-input v-model="form.airport_en" placeholder="例：Beijing Capital Internation Airport（选填）"/>
      </el-form-item>
      <el-form-item label="ICAO代码">
        <el-input v-model="form.icao_code" :disabled="status.nonCode" placeholder="例：ZBAA"/>
      </el-form-item>
      <el-form-item label="IATA代码">
        <el-input v-model="form.iata_code" :disabled="status.nonCode" placeholder="例：PEK"/>
      </el-form-item>
      <el-button @click="nonCodeMode">无代码地点</el-button>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="show = false">取消</el-button>
        <el-button
            type="primary" @click="submit()"
            v-loading="status.loading"
            :disabled="status.loading"
        >确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>

</style>