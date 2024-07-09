<script setup lang="ts">
import {ref} from 'vue'
import userInfoStore from '../stores/userInfo'
import {UserFilled} from '@element-plus/icons-vue'
import LoginDialog from './LoginDialog.vue';
import router from '@/router';

const user = userInfoStore();
const userPageText = ref("登录/注册");

const mobileMenuVisible = ref(false);
const loginDialogVisible = ref(false)

if (user.isLoggedIn) {
  userPageText.value = user.username;
}

const goUserPage = () => user.isLoggedIn ? router.push(`/myself`) : loginDialogVisible.value = true;
const showMobileMenu = () => mobileMenuVisible.value = (!mobileMenuVisible.value)

</script>

<template>
  <header>
    <div class="head-bar">
      <div>
        <a id="logo" href="/">
          <img style="width: 10em" src="https://source.cdn.794td.cn/TOGA/n_logo_w.jpg" alt="">
        </a>
      </div>
      <div class="head-bar-desk">
        <a href="/search">
          <div class="head-bar-item">
            搜索
          </div>
        </a>
        <a href="https://blog.togaphotos.com">
          <div class="head-bar-item">
            关于
          </div>
        </a>
        <a @click="goUserPage">
          <div class="head-bar-item">
            {{ userPageText }}
          </div>
        </a>
      </div>
      <div class="head-bar-mobile">
        <a @click="showMobileMenu()">
          <div class="icon-user">
            <el-icon>
              <UserFilled/>
            </el-icon>
          </div>
        </a>
      </div>
    </div>

    <div class="head-bar-menu" v-show="mobileMenuVisible">
      <div style="display: flex;justify-content: space-around;margin-bottom: 2em">
        <a href="/search">
          <div class="head-bar-menu-item">
            搜索
          </div>
        </a>
        <a href="https://blog.togaphotos.com">
          <div class="head-bar-menu-item">
            关于
          </div>
        </a>
      </div>
      <a @click="goUserPage()">
        <div class="user-page">
          {{ userPageText }}
        </div>
      </a>
      <div>
        <a @click="goUserPage()">
          <div>
            个人主页
          </div>
        </a>
      </div>
    </div>
  </header>
  <LoginDialog v-model="loginDialogVisible"/>
</template>

<style scoped>
header {
  /*background-color: #001529;*/
  background-color: #001A38;
  position: sticky;
  top: 0;
  z-index: 100;
  color: white;
}

.head-bar {
  margin: 0 auto;
  width: 100%;
  padding: 0 15px;
  max-width: var(--max-width);
  height: 64px;
  line-height: 64px;
  display: flex;
  justify-content: space-between;
}

#logo {
  height: 64px;
  display: block;
}

#logo img {
  margin-top: 32px;
  transform: translate(0, -50%);
}

.head-bar-menu {
  /*background-color: #001529;*/
  background-color: #002E4D;
  height: 150px;
  padding: 1em 25px;
  z-index: 999;
}

.head-bar-menu div {
  line-height: 1em;
}

.head-bar-menu-item {
  font-size: 1.1rem;
  line-height: 1em;
  color: white;
}

.head-bar-item {
  padding: 0 1vw;
  font-size: 1rem;
  font-weight: 600;
}

.user-page {
  font-weight: bolder;
  margin-top: 0.8em;
  padding-bottom: 0.4em;
  border-bottom: 1px solid white;
  margin-bottom: 0.6em;
}

.head-bar-item:hover {
  background-color: #1890ff;
}


@media only screen and (min-width: 701px) {
  .head-bar-desk {
    display: flex;
  }

  .head-bar-mobile {
    display: none;
  }
}

@media only screen and (max-width: 701px) {
  .head-bar-desk {
    display: none;
  }

  .head-bar-mobile {
    display: block;
  }
}

.icon-user {
  font-size: 1.5em;
  color: white;
  margin-top: 32px;
  transform: translate(0, -50%);
}

a {
  color: white;
  text-decoration: none;
}
</style>