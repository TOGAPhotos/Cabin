<script setup lang="ts">
import {reactive} from "vue";
import type {FullPhotoInfo} from "@/utils/type/photo";

const showPanel = defineModel({type:Boolean});
const props = defineProps<{photoInfo:FullPhotoInfo}>();

const formData = reactive({
  commercial:false,
  message:"",
  email:"",
});

function submit(){

}
</script>

<template>
  <el-dialog
      v-model="showPanel"
      title="联系摄影师"
      style="min-width: 300px"
  >
    您的消息将被转发给摄影师<strong>{{props.photoInfo.username}}</strong>
    <el-form
        label-position="top"
        style="margin: 1em 0 0 1em"
    >
      <el-form-item label="是否获取商业使用授权">
        <el-radio-group v-model="formData.commercial">
          <el-radio :value="true" size="large"><span class="red-font">获取商业授权</span></el-radio>
          <el-radio :value="false" size="large">不用做商业用途</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label=" 您的联系方式">
        <el-input v-model="formData.email"/>
      </el-form-item>
      <el-form-item label="留言">
        <el-input
            v-model="formData.message"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showPanel = false">取消</el-button>
        <el-button type="primary" @click="submit()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>