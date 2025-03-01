import { ElMessage } from 'element-plus';
import type {  UploadRawFile } from 'element-plus'
export async function checkImage(rawFile:UploadRawFile){
    
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('格式错误');
        return false
    }
    if (rawFile.size / 1024 / 1024 > 4) {
        ElMessage.error('图片大于4MB');
        return false
    }

    const fileReader = new FileReader()
    fileReader.readAsDataURL(rawFile)
    await new Promise<void>(resolve => fileReader.onload = () => resolve());
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = fileReader.result as string;
    await new Promise<void>(resolve => img.onload = () => resolve())
    const longSide = Math.max(img.width, img.height);
    if(longSide< 1279 || longSide > 1920){
        ElMessage.warning('尺寸超限')
        return false
    }

    return true;
}