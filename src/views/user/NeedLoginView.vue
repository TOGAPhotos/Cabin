<script setup lang="ts">
import userInfoStore from "@/stores/userInfo";

const user = userInfoStore();
</script>
<template>
  <div class="need-login-container">
    <h1>需要登录的页面</h1>
    <p>您已成功访问此需要登录的页面。</p>
    <p>用户名: {{ user.username }}</p>
    <p>邮箱: {{ user.email }}</p>
  </div>
</template>
<style scoped>
.need-login-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
}
h1 {
  color: #42b983;
  margin-bottom: 1rem;
}
p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}
</style>
