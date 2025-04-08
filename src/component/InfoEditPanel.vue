<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import AirtypeSelect from "@/components/selector/AircraftTypeSelect.vue";
import AirportSelect from "@/components/selector/AirportSelect.vue";
import AirlineSelect from "@/components/selector/AirlineSelect.vue";
import PhotoTypeSelectot from "@/components/PhotoTypeSelect.vue";
import ServerRequest from "@/utils/request";
import type { PhotoType } from "@/utils/type/photo";

const props = defineProps<{
    photoId: string;
}>();
const visible = defineModel({ type: Boolean, default: false });

const formData = reactive({
    ac_reg: "",
    ac_msn: "",
    ac_type: "",
    airport_id: 0,
    airline_id: 0,
    pic_type: [] as PhotoType[],
})
const photoTypeList: PhotoType[] = [
    { label: "机场", value: "A" },
    { label: "机舱", value: "C" },
    { label: "展品", value: "M" },
    { label: "军机", value: "P", class: 'rev-color' },
    { label: "事故", value: "I" },
    { label: "特殊涂装", value: "S", class: 'rev-color' },
    { label: "火箭及航天器", value: "R" },
    { label: "非固定翼航空器", value: "O" },
    { label: "滑翔机", value: "G" }
]
const photoTypeDecoder = (value: string | null | undefined): PhotoType[] => {
    if (!value) return []
    value = value.trim()
    if (value.length === 0) {
        return []
    }
    try {
        return value.split(',')
            .map(v => <PhotoType>photoTypeList.find(t => t.value === v))
            .sort((a, _) => a.requirement ? 1 : -1)
    } catch (e) {
        return []
    }
}
onMounted(async () => {
    const req = new ServerRequest('GET', `/photo/${props.photoId}`)
    req.success = () => {
        const data = req.getData()
        formData.ac_reg = data.ac_reg
        formData.ac_msn = data.ac_msn
        formData.ac_type = data.ac_type
        formData.airport_id = data.airport_id
        formData.airline_id = data.airline_id
        formData.pic_type = photoTypeDecoder(data.pic_type)
    }
    req.error = (code, msg) => {
        ElMessage.error(msg)
    }
    await req.send()
})
const updatePhotoInfo = async () => {
    const data = {
        ...formData,
        pic_type: formData.pic_type.join(',')
    }
    const req = new ServerRequest('PUT', `/photo/${props.photoId}`, data)
    req.success = () => {
        ElMessage.success('更新成功')
        visible.value = false
    }
    req.error = (code, msg) => {
        ElMessage.error(msg)
    }
    await req.send()
}
</script>
<template>
    <el-dialog :key="photoId" v-model="visible" ref="infoPanel" style="max-width: 30em;">
        <el-form :model="formData" label-position="right" label-width="auto">
            <el-form-item label="注册号/机身编号">
                <el-input v-model="formData.ac_reg" />
            </el-form-item>
            <el-form-item label="制造商序列号">
                <el-input v-model="formData.ac_msn" />
            </el-form-item>
            <el-form-item label="航空器型号">
                <AirtypeSelect v-model="formData.ac_type" />
            </el-form-item>
            <el-form-item label="拍摄地点">
                <AirportSelect v-model="formData.airport_id" />
            </el-form-item>
            <el-form-item label="航空公司">
                <AirlineSelect v-model="formData.airline_id" />
            </el-form-item>
            <el-form-item label="图片分类">
                <PhotoTypeSelectot v-model="formData.pic_type" />
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="updatePhotoInfo">确 定</el-button>
        </div>
    </el-dialog>
</template>
<style scoped></style>