<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router';
import userInfoStore from '@/stores/userInfo'
import {UserFilled} from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    isMobile?: boolean;
}>(),{
    isMobile: false
});

const emit = defineEmits();
const user = userInfoStore();
const userPageText = ref("登录/注册");
const mobileMenuVisible = ref(false)

const goUserPage = () => user.isLoggedIn ? router.push(`/myself`) : emit('loginDialogVisible', true);
const showMobileMenu = () => {
  mobileMenuVisible.value = (!mobileMenuVisible.value)
  emit('mobileMenuVisible', mobileMenuVisible.value)
}


</script>

<template>
    <a v-if="!isMobile" @click="goUserPage" class="login-btn">
      <div class="login-btn-text">
        {{ userPageText }}
      </div>
    </a>
    <a v-else @click="showMobileMenu()" class="login-btn-mobile">
      <div class="icon-user">
        <el-icon>
          <UserFilled/>
        </el-icon>
      </div>
    </a>
</template>

<style scoped>
.login-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    height: 100%;
    cursor: pointer;
}
.login-btn:hover{
    background-color: #1890ff;
}
.login-btn-text{
    font-size: 1rem;
}
.login-btn-mobile{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  height: 100%;
}
</style>