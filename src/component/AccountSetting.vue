<script setup lang="ts">
import AirportSelect from "@/components/selector/AirportSelect.vue";
import router from "@/router";
import useUserInfoStore from "@/stores/userInfo";
import ServerRequest from "@/utils/request";
import type { AcceptPhoto } from "@/utils/type/photo";
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const panelVisible = defineModel({ type: Boolean, default: false });
const user = useUserInfoStore();
const loading = ref(false);
const accountSetting = reactive({
  username: user.username,
  email: user.email,
  toga: false,
  thirdParty: false,
  airportId: undefined as number | undefined,
  coverPhotoId: undefined,
});
const photoList = ref<{ label: string; value: string }[]>([]);

onMounted(async () => {
  const userInfoReq = new ServerRequest("GET", `/user/${user.id}`);
  userInfoReq.success = () => {
    const userInfo = userInfoReq.getData("userInfo");
    accountSetting.toga = userInfo.allow_toga_use;
    accountSetting.thirdParty = userInfo.allow_third_use;
    accountSetting.airportId = userInfo.airport_id;
    accountSetting.coverPhotoId = userInfo.cover_photo_id;

    photoList.value = userInfoReq
      .getData("photoList")
      .map((photo: AcceptPhoto) => {
        return {
          value: photo.id,
          label: `${photo.id}|${photo.airline_cn || photo.airline_en}-${photo.ac_type}`,
        };
      });
  };
  await userInfoReq.send();
});

async function submit() {
  loading.value = true;
  const updateInfo = {
    username: accountSetting.username,
    airport_id: accountSetting.airportId,
    allow_toga_use: accountSetting.toga,
    allow_third_use: accountSetting.thirdParty,
    cover_photo_id: accountSetting.coverPhotoId,
  };
  const updateReq = new ServerRequest("PUT", `/user/${user.id}`, updateInfo);
  updateReq.success = (msg) => {
    ElMessage.success(msg);
    panelVisible.value = false;
    router.go(0);
  };
  updateReq.error = (code, msg) => ElMessage.error(msg);
  await updateReq.send();

  loading.value = false;
}
</script>

<template>
  <el-drawer
    v-loading="loading"
    v-model="panelVisible"
    direction="rtl"
    title="账户设置"
    size="100%"
  >
    <h4 style="margin-bottom: 0.8rem">账户信息</h4>

    <el-form label-position="top">
      <el-form-item label="邮箱">
        <el-input disabled v-model="accountSetting.email" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="accountSetting.username" />
      </el-form-item>
      <el-form-item label="机场">
        <AirportSelect v-model="accountSetting.airportId" />
      </el-form-item>
      <el-form-item label="个人首页头图">
        <el-select v-model="accountSetting.coverPhotoId" filterable>
          <el-option
            v-for="img in photoList"
            :label="img.label"
            :value="img.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="setting-item">
      <h4>授权TOGAPhotos使用您的图片</h4>
      <div>
        允许我们在不事先通知您的情况下，将您的图片发布在TOGAPhotos所属的社交媒体上
      </div>
      <el-radio-group v-model="accountSetting.toga">
        <el-radio :value="true" size="large">授权</el-radio>
        <el-radio :value="false" size="large"
          ><span class="red-font">撤销授权</span></el-radio
        >
      </el-radio-group>
    </div>
    <div class="setting-item">
      <h4>授权第三方使用您的图片</h4>
      <div>
        允许我们的合作伙伴在遵循 CC BY-NC-ND 4.0
        协议的情况下，可以在使用图片时不事先与您取得联系
      </div>
      <div style="font-size: 0.8em">
        <strong>CC BY-NC-ND 4.0 协议</strong>:
        简单来说，这项协议要求第三方合作伙伴遵守三个限制：需要以适当的方式署名作者；不可以将您的作品用于商业用途；不可以对您的作品进行二次加工。
      </div>
      <el-radio-group v-model="accountSetting.thirdParty">
        <el-radio :value="true" size="large">授权</el-radio>
        <el-radio :value="false" size="large"
          ><span class="red-font">撤销授权</span></el-radio
        >
      </el-radio-group>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="() => (panelVisible = false)">取消</el-button>
        <el-button type="primary" @click="submit()">确认变更</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.setting-item {
  margin-bottom: 1rem;
}
h4 {
  font-size: 18px;
  font-weight: bold;
}
.setting-item .el-input {
  width: 75%;
}
</style>
