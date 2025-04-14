<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import userInfoStore from "@/stores/userInfo";
import router from "@/router";
import { useRoute } from "vue-router";
import { transparentNameList, floatNameList } from "./config";
import SearchBox from "@/component/header/SearchBox.vue";
import LoginButton from "@/component/header/LoginButton.vue";

const header = ref<HTMLElement | null>(null);
const user = userInfoStore();
const userPageText = ref("登录/注册");
const route = useRoute();

const mobileMenuVisible = ref(false);
const loginDialogVisible = ref(false);
const lastScrollTop = ref(0);
const showHeadBar = ref(true);
const isAtTop = ref(true);
const isMouseOn = ref(false);

if (user.isLoggedIn) {
  userPageText.value = user.username;
}

const goUserPage = () =>
  user.isLoggedIn ? router.push(`/myself`) : (loginDialogVisible.value = true);
const showMobileMenu = () =>
  (mobileMenuVisible.value = !mobileMenuVisible.value);

const isTransparentBg = computed(() => {
  if (typeof route.name === "string") {
    if (transparentNameList.includes(route.name)) {
      return true;
    }
  }
  return false;
});

const isFloat = computed(() => {
  if (typeof route.name === "string") {
    if (floatNameList.includes(route.name)) {
      return true;
    }
  }
  return false;
});

function windowScroll() {
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;
  if (currentScrollTop === 0) {
    isAtTop.value = true;
  } else {
    isAtTop.value = false;
  }
  if (currentScrollTop > lastScrollTop.value) {
    showHeadBar.value = false;
  } else {
    showHeadBar.value = true;
  }
  lastScrollTop.value = currentScrollTop;
}

const handleLoginClick = (value: boolean) => router.push("/login");
const handleMobileLoginClick = (value: boolean) =>
  (mobileMenuVisible.value = value);
const handleMouseEnter = () => (isMouseOn.value = true);
const handleMouseLeave = () => (isMouseOn.value = false);

onMounted(() => {
  window.addEventListener("scroll", windowScroll);
  if (header.value) {
    header.value.addEventListener("mouseenter", handleMouseEnter);
    header.value.addEventListener("mouseleave", handleMouseLeave);
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", windowScroll);
  if (header.value) {
    header.value.removeEventListener("mouseenter", handleMouseEnter);
    header.value.removeEventListener("mouseleave", handleMouseLeave);
  }
});
</script>

<template>
  <header
    :class="[
      isFloat ? (showHeadBar ? 'fade-in-down' : 'fade-out-up') : '',
      isAtTop && !isMouseOn && isTransparentBg ? 'transparent-bg' : '',
      isFloat ? 'float' : 'fixed',
    ]"
    ref="header"
  >
    <div class="head-bar">
      <div>
        <a id="logo" href="/">
          <img
            style="width: 10em"
            src="https://source.cdn.794td.cn/TOGA/n_logo_w.jpg"
            alt=""
          />
        </a>
      </div>
      <div class="head-bar-desk">
        <SearchBox :isFocus="isMouseOn"></SearchBox>
        <LoginButton @loginDialogVisible="handleLoginClick"></LoginButton>
      </div>
      <div class="head-bar-mobile">
        <SearchBox :isMobile="true"></SearchBox>
        <LoginButton
          :isMobile="true"
          @mobileMenuVisible="handleMobileLoginClick"
        ></LoginButton>
      </div>
    </div>

    <div class="head-bar-menu" v-show="mobileMenuVisible">
      <div
        style="display: flex; justify-content: space-around; margin-bottom: 2em"
      >
        <a href="/search">
          <div class="head-bar-menu-item">图库</div>
        </a>
        <a href="https://blog.togaphotos.com">
          <div class="head-bar-menu-item">关于</div>
        </a>
      </div>
      <a @click="goUserPage()">
        <div class="user-page">
          {{ userPageText }}
        </div>
      </a>
      <div>
        <a @click="goUserPage()">
          <div>个人主页</div>
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  /*background-color: #001529;*/
  background-color: #001a38;
  /* position: fixed;
  top: 0;
  z-index: 100; */
  width: 100%;
  color: white;
  transition: all 0.5s ease;
}
.float {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
}
.fixed {
  position: relative;
  z-index: 100;
  width: 100%;
}
.transparent-bg {
  background-color: transparent;
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
  background-color: #002e4d;
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

.login-btn {
  cursor: pointer;
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

.fade-in-down {
  animation: fadeInDown 0.5s forwards;
}

.fade-out-up {
  animation: fadeOutUp 0.5s forwards;
}

@keyframes fadeInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeOutUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}

@media only screen and (min-width: 701px) {
  .head-bar-desk {
    width: 31rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
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
    /* background-color: red; */
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
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
