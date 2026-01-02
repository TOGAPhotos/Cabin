import type { UploadRawFile } from "element-plus";
import { ElNotification } from "element-plus";
export async function checkImage(rawFile: UploadRawFile) {
  if (rawFile.type !== "image/jpeg") {
    ElNotification.error({
      title: "文件错误",
      message: "我们只支持 JPEG 格式的图片",
    });
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 8) {
    ElNotification.error({
      title: "文件错误",
      message: "图片大小不能超过8MB",
    });
    return false;
  }

  const fileReader = new FileReader();
  fileReader.readAsDataURL(rawFile);
  await new Promise<void>((resolve) => (fileReader.onload = () => resolve()));
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = fileReader.result as string;
  await new Promise<void>((resolve) => (img.onload = () => resolve()));
  const longSide = Math.max(img.width, img.height);
  if (longSide < 1279) {
    ElNotification.error({
      title: "图片分辨率过低",
      message: "长边需大于1280像素",
    });
    return false;
  }
  if (longSide > 2160) {
    ElNotification.error({
      title: "图片分辨率过高",
      message: "长边需小于等于2160像素",
    });
    return false;
  }
  return true;
}
