<script setup lang="ts">
import ImgLoader from "@/components/ImgLoader.vue";
import router from "@/router";
import ServerRequest from "@/utils/request";
import { onMounted, reactive,ref } from "vue";
const info = reactive({
    startTime: '',
    endTime: '',
    _type: 'ERROR',
    type: '',
    remark: '',
})
const converTime = (time: string) => {
    return new Date(time + ' GMT+8');
}
const loading = ref(true);

onMounted(async () => {
    const check = new ServerRequest('GET', '/website')
    check.success = () => {
        if ( import.meta.env.MODE === 'development') return;
        router.push('/')
    }
    const [maintenance, _] = await Promise.all([
        fetch('https://status.togaphotos.com/api/maintenance'),
        check.send(),
    ])
    loading.value = false;
    if (maintenance.ok) {
        const data = await maintenance.json()
        const _s = converTime(data['start_time']);
        const _e = converTime(data['end_time']);
        if (_s.getTime() > Date.now() || _e.getTime() < Date.now()) {
            info._type = 'ERROR'
            return;
        }
        info.startTime = _s.toLocaleString('zh-CN');
        info.endTime = _e.toLocaleString('zh-CN');
        info._type = data['type'];
        info.type = data['type'] === 'scheduled' ? '计划内的' : '突发';
        info.remark = data['remark'];
    }
})
</script>
<template>
    <div class="maintenance">
        <div style="margin-bottom: 1em;">
            <ImgLoader src="/maintenance_fox.webp" alt="Maintenance Fox" protect />
        </div>
        <div v-if="loading">
            <h2>正在检查维护计划......</h2>
        </div>
        <div v-else>
            <div v-if="info._type === 'ERROR'">
                <h2>目前没有维护计划</h2>
                <p>出现这种情况，可能是您的网络不稳定，或者是网站正在经历突发故障。</p>
            </div>
            <div v-else>
                <h2>正在进行{{ info.type }}维护</h2>
                <h3>{{ info.remark }}</h3>
                <p>开始时间：{{ info.startTime }}</p>
                <p>结束时间：{{ info.endTime }}</p>
            </div>
        </div>
    </div>
</template>
<style>
.maintenance {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100dvh - 120px);
    padding: 0 1em;
}

.maintenance img {
    width: 100%;
    max-width: 300px;
    height: auto;
}
</style>