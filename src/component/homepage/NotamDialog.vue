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
  // Allow only <br> and <b>, escape all other tags/characters
  const tokens = [
    { re: /<br\s*\/?>/gi, token: "__BR__" },
    { re: /<b>/gi, token: "__B_OPEN__" },
    { re: /<\/b>/gi, token: "__B_CLOSE__" },
  ];
  let s = input || "";
  for (const { re, token } of tokens) s = s.replace(re, token);
  s = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  return s
    .split("__BR__")
    .join("<br>")
    .split("__B_OPEN__")
    .join("<b>")
    .split("__B_CLOSE__")
    .join("</b>");
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
