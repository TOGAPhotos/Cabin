<script setup lang="ts">
import useUserInfoStore from "@/stores/userInfo";
import ServerRequest from "@/utils/request";
import { onMounted, ref } from "vue";

const user = useUserInfoStore();

const visible = ref(false);
const title = ref("");
const htmlContent = ref("");
const notamId = ref<number | null>(null);

function sanitizeNotamHtml(input: string): string {
  if (!input || input === "") return "";
  return input.replace(/<\s*a\b[^>]*>/gi, "").replace(/<\s*\/\s*a\s*>/gi, "");
}

const notamReq = new ServerRequest("GET", "/notam");
notamReq.success = () => {
  const t = notamReq.getData("title");
  const id = notamReq.getData("id");
  const c = notamReq.getData("content") || "";
  if (t === "NOTAM CLSD" || id === user.notam) return;
  title.value = t;
  htmlContent.value = sanitizeNotamHtml(c);
  notamId.value = id;
  visible.value = true;
};

function onClose() {
  if (notamId.value !== null) user.notam = notamId.value;
}

onMounted(() => {
  notamReq.send();
});
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="520px"
    :center="true"
    @close="onClose"
  >
    <div class="notam-content" v-html="htmlContent" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="visible = false">我知道了</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.notam-content {
  line-height: 1.6;
  word-break: break-word;
}
</style>
