<script setup lang="ts">
import { reactive } from "vue";
import type { AcceptPhoto } from "@/utils/type/photo";
import useUserInfoStore from "@/stores/userInfo";
import ServerRequest from "@/utils/request";
import { ElMessage, ElNotification } from "element-plus";

const showPanel = defineModel({ type: Boolean });
const props = defineProps<{ photoInfo: AcceptPhoto }>();
const user = useUserInfoStore();
const formData = reactive({
  message: "",
  email: user.email,
});

const messages = [
  "想要使用原图（商业使用）",
  "想要使用原图（非商业使用）",
  "询问拍摄信息",
];

async function submit() {
  const dm = {
    receiverId: props.photoInfo.upload_user_id,
    contactInfo: formData.email,
    photoId: props.photoInfo.id,
    content: formData.message,
  };
  const dmReq = new ServerRequest("POST", "/dm", dm);
  dmReq.success = () => {
    showPanel.value = false;
    ElNotification.success({
      title: "发送成功",
      message: "您的消息已经发送给摄影师",
    });
  };
  dmReq.error = (_, msg) => {
    ElNotification.error({
      title: "发送失败",
      message: msg,
    });
  };
  await dmReq.send();
}
</script>

<template>
  <el-dialog
    v-model="showPanel"
    title="联系摄影师"
    style="min-width: 300px; max-width: 475px"
  >
    您的消息将被转发给摄影师<strong>{{ props.photoInfo.username }}</strong
    >,请确保您的联系方式正确。
    <el-form label-position="top" style="margin: 1em 0 0 1em">
      <el-form-item label=" 您的联系方式">
        <el-input v-model="formData.email" />
      </el-form-item>
      <el-form-item label="留言">
        <el-select v-model="formData.message" placeholder="请选择联系原因">
          <el-option v-for="m in messages" :label="m" :value="m" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showPanel = false">取消</el-button>
        <el-button type="primary" @click="submit()"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
