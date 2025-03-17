<script setup lang="ts">
import {reactive} from "vue";
import type {AcceptPhoto} from "@/utils/type/photo";
import useUserInfoStore from "@/stores/userInfo";

const showPanel = defineModel({type:Boolean});
const props = defineProps<{photoInfo:AcceptPhoto}>();
const user = useUserInfoStore();
const formData = reactive({
  message:"",
  email:user.email,
});

const messages = [
  "想要使用原图（商业使用）",
  "想要使用原图（非商业使用）",
  "询问拍摄信息",
]

function submit(){

}
</script>

<template>
  <el-dialog
      v-model="showPanel"
      title="联系摄影师"
      style="min-width: 300px"
  >
    您的消息将被转发给摄影师<strong>{{props.photoInfo.username}}</strong>,请确保您的联系方式正确。
    <el-form
        label-position="top"
        style="margin: 1em 0 0 1em"
    >
      <el-form-item label=" 您的联系方式">
        <el-input v-model="formData.email"/>
      </el-form-item>
      <el-form-item label="留言">
        <el-select v-model="formData.message" placeholder="请选择留言模板">
          <el-option v-for="m in messages" :label="m" :value="m" />
        </el-select>
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