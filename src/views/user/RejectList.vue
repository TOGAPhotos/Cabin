<script setup lang="ts">
// import { PhotoUrl } from '@/utils/photo-url';
import ServerRequest from '@/utils/request';
import type { RejectPhotoInfo } from '@/utils/type/photo';
import { ref } from 'vue';
import RejectThumbnail from "@/components/RejectThumbnail.vue";



const rejectPhotoList = ref<RejectPhotoInfo[]>([]);

(
    async () => {
        const req = new ServerRequest('GET', '/queue/reject');
        req.success = () => rejectPhotoList.value = req.getData('rejectList');
        await req.send();
    }
)()
</script>
<template>
    <div>
        <h1>未过审队列</h1>
        <div>
            <p class="cn-content">
                胜败乃兵家常事，如果您不是很理解为什么您的照片没有通过审核，可以查看由审核团队制作的
                <a href="https://guide.togaphotos.com">上传指南</a>
                。
            </p>
            <p class="cn-content">
                <strong>请注意，未过审图片会在一个月后被自动删除。</strong>
            </p>
        </div>

        <div class="reject-list">
          <RejectThumbnail
              v-for="photo in rejectPhotoList"
              :id="photo.id"
              :reg="photo.ac_reg"
              :reason="photo.reason"
              :comment="photo.comment"
          />
        </div>
    </div>
</template>
<style scoped>
.reject-list{
    margin-top: 2em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}


</style>