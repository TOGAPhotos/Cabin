<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import Device from "@/utils/device";
import {ElMessage} from "element-plus";
import ServerRequest from "@/utils/request";

const show = defineModel({type:Boolean});
const status = reactive({
  loading: false,
})

const form = reactive({
  airline_cn:"",
  airline_en:"",
  icao_code:"",
  iata_code:"",
});
const setWidth = computed(()=> Device.isPhone() ? '100%' : 500)

async function submit(){
  if(status.loading) return;

  if(form.airline_en === ""){
    ElMessage.error("英文名不能为空");
    return;
  }
  if(form.icao_code === ""){
    ElMessage.error("ICAO 不能为空");
    return;
  }

  status.loading=true;
  const req = new ServerRequest("POST","/airline",form);
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
      v-model="show" title="添加航司/运营人"
      :size="setWidth" direction="ltr"
  >
    <div>
      <h3 style="margin-bottom: 0.8rem">填写说明</h3>
      <p>如航司无官方中文名称，则中文名称可留空。</p>
    </div>
    <el-divider/>
    <el-form
        label-position="top"
    >
      <el-form-item label="中文名">
        <el-input v-model="form.airline_cn" placeholder="例：中国国际航空"/>
      </el-form-item>
      <el-form-item label="英文名">
        <el-input v-model="form.airline_en" placeholder="例：Air China"/>
      </el-form-item>
      <el-form-item label="ICAO代码">
        <el-input v-model="form.icao_code" placeholder="例：CCA"/>
      </el-form-item>
      <el-form-item label="IATA代码">
        <el-input v-model="form.iata_code" placeholder="例：CA"/>
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