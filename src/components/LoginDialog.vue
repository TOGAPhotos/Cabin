<script setup lang="ts">
import {reactive, ref} from 'vue'
import userInfoStore from '../stores/userInfo'
import {ElNotification, type FormInstance, type FormRules} from 'element-plus'
import serverRequest from '../utils/request'
import router from "@/router";

const loginDialogVisible = defineModel({type: Boolean})
const user = userInfoStore();

interface LoginForm {
  email: string;
  password: string;
}

const loginForm = reactive<LoginForm>({
  email: '',
  password: ''
});

const loginRules = reactive<FormRules<LoginForm>>({
  email: [
    {required: true, message: "请输入邮箱", trigger: "blur"},
    {type: "email", message: "请输入正确的邮箱", trigger: "blur"},
  ],
  password: [
    {required: true, message: "请输入密码", trigger: "blur"},
  ]
})
const loginFormRef = ref<FormInstance>()

async function login() {
  if (!loginFormRef.value) {
    return
  }

  if (!await loginFormRef.value.validate()) {
    return
  }

  const loginRequest = new serverRequest('POST', '/user/login', {
    email: loginForm.email,
    password: loginForm.password
  })

  loginRequest.success = () => {
    const id = loginRequest.getData('id') as number;
    const username = loginRequest.getData('username') as string;
    const token = loginRequest.getData('token') as string;
    const expireTime = loginRequest.getData('expireTime') as number;
    const permission = loginRequest.getData('permission') as string;
    user.setUserInfo(id, username, token, expireTime, permission);
    loginDialogVisible.value = false;
    router.go(0);
  }

  loginRequest.error = (code, msg) => ElNotification.error(msg)

  await loginRequest.send()

}
router.afterEach(()=> loginDialogVisible.value = false)
</script>

<template>
  <el-dialog v-model="loginDialogVisible" width="600">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass" style="font-weight: bolder">登陆</h4>
      </div>
    </template>
    <el-form ref="loginFormRef"
             :model="loginForm"
             :rules="loginRules"
             label-position="top"
             style="max-width: 500px;margin: 12px auto;"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="loginForm.email"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" show-password/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="login()">登陆</el-button>
      <el-button>注册</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.my-header{
  padding: 0 0 0.5rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}
</style>