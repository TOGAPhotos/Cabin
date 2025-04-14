<script setup lang="ts">
import { reactive, useTemplateRef, watch } from "vue";

import Device from "@/utils/device";
import { ElLoading } from "element-plus";

const dialogVisible = defineModel({ default: false });
const finalPosition = defineModel("watermark", {
  default: { x: -1, y: -1, s: 0, a: 0 },
});
const emits = defineEmits(["finish"]);

const props = defineProps<{ file: File | undefined }>();
const PHOTO = new Image();

const confirmWatermark = (add: Boolean) => {
  dialogVisible.value = false;
  if (!add) {
    finalPosition.value = { x: -1, y: -1, s: 0, a: 0 };
    return;
  } else {
    finalPosition.value.x = watermark.position.x / canvasInfo.scale;
    finalPosition.value.y = watermark.position.y / canvasInfo.scale;
    finalPosition.value.s = watermark.scale;
    finalPosition.value.a = watermark.alpha;
  }
  emits("finish");
};

const watermarkImg = new Image();

const canvas = useTemplateRef<HTMLCanvasElement>("watermark-canvas");
const canvasInfo = {
  position: { x: 0, y: 0 },
  scale: -1,
};

const watermark = reactive({
  alpha: 0.5,
  scale: 1,
  position: { x: 0, y: 0 },
  size: { width: 0, height: 0 },
});

const moveWaterMark = (event: MouseEvent | TouchEvent) => {
  const inputX =
    event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  const inputY =
    event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  const x = inputX - (canvasInfo.position.x + watermark.size.width / 2);
  const y = inputY - (canvasInfo.position.y + watermark.size.height);
  // const y = inputY - (canvasInfo.position.y)

  if (
    x >= 0 &&
    x <= canvas.value!.width - watermark.size.width &&
    y >= 0 &&
    y <= canvas.value!.height - watermark.size.height
  ) {
    watermark.position.x = x;
    watermark.position.y = y;
  }
};

const drawWatermark = () => {
  const ctx = canvas.value!.getContext("2d");

  ctx!.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  ctx!.globalAlpha = 1;
  ctx!.drawImage(PHOTO, 0, 0, canvas.value!.width, canvas.value!.height);

  watermark.size.width =
    watermarkImg.width * watermark.scale * canvasInfo.scale;
  watermark.size.height =
    watermarkImg.height * watermark.scale * canvasInfo.scale;
  ctx!.globalAlpha = watermark.alpha;
  ctx!.drawImage(
    watermarkImg,
    watermark.position.x,
    watermark.position.y,
    watermark.size.width,
    watermark.size.height,
  );
  ctx!.globalAlpha = 1;
};

watch(
  () => canvas.value,
  async (value) => {
    if (!value) return;

    const watermarkDailog = useTemplateRef("watermark-dialog");
    const loading = ElLoading.service({
      target: <HTMLElement>watermarkDailog.value,
      text: "加载中...",
    });

    try {
      const photoLoading = new Promise((resolve) => (PHOTO.onload = resolve));
      PHOTO.src = URL.createObjectURL(<File>props.file);
      await photoLoading;
      canvas.value!.width = Math.min(Device.getWidth() * 0.9, 800);
      canvasInfo.scale = canvas.value!.width / PHOTO.width;
      canvas.value!.height = PHOTO.height * canvasInfo.scale;

      const watermarkLoading = new Promise(
        (resolve) => (watermarkImg.onload = resolve),
      );
      watermarkImg.crossOrigin = "anonymous";
      watermarkImg.src = "https://source.cdn.794td.cn/TOGA/watermark.png";

      const { left, top } = canvas.value!.getBoundingClientRect();
      canvasInfo.position.x = left;
      canvasInfo.position.y = top;

      await watermarkLoading;

      canvas.value!.addEventListener("mousedown", (event) => {
        moveWaterMark(event);
        canvas.value!.addEventListener("mousemove", moveWaterMark);
      });
      canvas.value!.addEventListener("mouseup", () => {
        canvas.value!.removeEventListener("mousemove", moveWaterMark);
      });

      canvas.value!.addEventListener("touchstart", (event) => {
        moveWaterMark(event);
        canvas.value!.addEventListener("touchmove", moveWaterMark);
      });

      canvas.value!.addEventListener("touchend", () => {
        canvas.value!.removeEventListener("touchmove", moveWaterMark);
      });

      drawWatermark();
    } finally {
      loading.close();
    }
  },
);

watch(
  () => [
    watermark.alpha,
    watermark.scale,
    watermark.position.x,
    watermark.position.y,
  ],
  () => drawWatermark(),
);
</script>
<template>
  <el-dialog
    title="水印设置"
    v-model="dialogVisible"
    width="fit-content"
    ref="watermark-dialog"
    oncontextmenu="return false"
  >
    <div>
      <canvas ref="watermark-canvas"></canvas>
      <div style="margin: 0.2rem 1rem">
        <strong>水印透明度</strong>
        <el-slider
          v-model="watermark.alpha"
          :min="0.3"
          :max="0.7"
          :step="0.01"
          :show-tooltip="false"
        />
        <strong>水印大小</strong>
        <el-slider
          v-model="watermark.scale"
          :min="0.5"
          :max="1.5"
          :step="0.1"
          :show-tooltip="false"
        />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="confirmWatermark(false)">不添加</el-button>
        <el-button type="primary" @click="confirmWatermark(true)">
          添加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
