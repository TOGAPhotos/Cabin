<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import Device from "@/utils/device";
import {ElMessage} from "element-plus";
import ServerRequest from "@/utils/request";

const show = defineModel({type:Boolean,default:false});
const status = reactive({
  loading: false,
})

const form = reactive({
  manufacturer_cn:"",
  manufacturer_en:"",
  type:"",
  sub_type:"",
  icao_code:"",
});
const setWidth = computed(()=> Device.isPhone() ? '100%' : 500)

async function submit(){
  if(status.loading) return;

  if(form.manufacturer_en === "" && form.manufacturer_cn === ""){
    ElMessage.error("制造商名称不能全部留空");
    return;
  }
  if(form.type === "" || form.sub_type === ""){
    ElMessage.error("型号不能为空");
    return;
  }

  status.loading=true;
  const req = new ServerRequest("POST","/airtype",form);
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
      v-model="show" title="添加机型"
      :size="setWidth" direction="ltr"
  >
    <div>
      <h3 style="margin-bottom: 0.8rem">填写说明</h3>
      <p>海外制造商必须填写英文，中国制造商必须填写中文。</p>
    </div>
    <el-divider/>
    <el-form
        label-position="top"
    >
      <el-form-item label="制造商中文名">
        <el-input v-model="form.manufacturer_en" placeholder="例：空中客车"/>
      </el-form-item>
      <el-form-item label="制造商英文名">
        <el-input v-model="form.manufacturer_cn" placeholder="例：Airbus"/>
      </el-form-item>
      <el-form-item label="型号">
        <el-input v-model="form.type" placeholder="例：A330"/>
      </el-form-item>
      <el-form-item label="具体子型号">
        <el-input v-model="form.sub_type" placeholder="例：A330—343"/>
      </el-form-item>
      <el-form-item label="ICAO代码">
        <el-input v-model="form.icao_code" placeholder="例：A333"/>
      </el-form-item>
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