<script setup lang="ts">
import {reactive, ref} from 'vue'
import userInfoStore from '@/stores/userInfo'
import {ElNotification,} from 'element-plus'
import ServerRequest from '@/utils/request'
import router from "@/router";

interface LoginForm {
  email: string;
  password: string;
}

const loginForm = reactive<LoginForm>({
  email: '',
  password: ''
});

const user = userInfoStore()

if(user.isLoggedIn){
  router.replace('/')
}

async function login () {
  // valid form
  if (!loginForm.email || !loginForm.password) {
    return ElNotification.error({
      title: '错误',
      message: '请输入邮箱和密码'
    });
  }
  const loginRequest = new ServerRequest('POST', '/user/login', {
    email: loginForm.email,
    password: loginForm.password
  })
  loginRequest.success = () => {
    const id = loginRequest.getData('id') as number;
    const username = loginRequest.getData('username') as string;
    const token = loginRequest.getData('token') as string;
    const expireTime = loginRequest.getData('expireTime') as number;
    const permission = loginRequest.getData('permission') as string;
    user.setUserInfo({
      id, 
      username, 
      email:loginForm.email, 
      token, 
      expireTime, 
      permission
    });
    router.push('/');
  }
  loginRequest.error = (_,msg) => {
    ElNotification.error({
      title: '登陆时发生错误',
      message: msg
    });
  }
  const loginRes = await loginRequest.send()
  
  if (loginRes) return router.push('/')

}

</script>
<template>
  <div id="login-view" class="login-container">
    <img id="login-logo-img" src="https://source.cdn.794td.cn/TOGA/n_logo_b.jpg"/>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">邮箱:</label>
        <input
          type="text"
          id="username"
          v-model="loginForm.email"
          required
        />
        <div class="right-align">
          <a href="/register">> 没有账号？点击注册</a>
        </div>
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input
          type="password"
          id="password"
          v-model="loginForm.password"
          required
        />
        <div class="right-align">
          <a href="/forget">> 忘记密码</a>
        </div>
      </div>
      <div class="form-group" style="margin-top: 2em;">
        <button type="submit" class="login-button"><h2>登陆</h2></button>
      </div>
    </form>
  </div>
</template>
<style scoped>

#login-logo-img{
  width: 70%;
  display: block;
  margin: 0 auto 2em auto;
}
.login-container{
  width: 80vw;
  max-width: 450px!important;
  height: calc(100vh - 187px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
input:focus {
  border-bottom-color: #42b983;
}
button{
  border: none;
  padding: 0.4em 0;
  color: white;
  background-color: #409EFF;
}
</style>