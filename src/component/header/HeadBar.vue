<script setup lang="ts">
import LoginButton from "@/component/header/LoginButton.vue";
import SearchBox from "@/component/header/SearchBox.vue";
import router from "@/router";
import userInfoStore from "@/stores/userInfo";
import { onMounted, onUnmounted, ref } from "vue";

const header = ref<HTMLElement | null>(null);
const user = userInfoStore();
const userPageText = ref("登录/注册");

const mobileMenuVisible = ref(false);
const lastScrollTop = ref(0);
const showHeadBar = ref(true);
const isAtTop = ref(true);
const isMouseOn = ref(false);

if (user.isLoggedIn) {
  userPageText.value = user.username;
}

const goUserPage = () => {
  if (user.isLoggedIn) {
    router.push(`/myself`);
  } else {
    router.push(`/login`);
    mobileMenuVisible.value = false;
  }
};

function windowScroll() {
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;
  isAtTop.value = currentScrollTop === 0;
  showHeadBar.value = currentScrollTop <= lastScrollTop.value;
  lastScrollTop.value = currentScrollTop;
}

const handleLoginClick = () => router.push("/login");
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
  <header class="fixed top-0 left-0 z-2001" ref="header">
    <div class="global-container head-bar">
      <div>
        <a id="logo" href="/">
          <img
            class="select-none"
            style="width: 10em"
            src="https://cos-125-tp-cdn.794td.cn/assets/n_logo_w.jpg"
            alt=""
          />
        </a>
      </div>
      <div class="head-bar-desk">
        <SearchBox :isFocus="isMouseOn"></SearchBox>
        <LoginButton @loginDialogVisible="handleLoginClick" />
      </div>
      <div class="head-bar-mobile">
        <SearchBox :isMobile="true"></SearchBox>
        <LoginButton
          :isMobile="true"
          @mobileMenuVisible="handleMobileLoginClick"
        />
      </div>
    </div>

    <div class="head-bar-menu" v-show="mobileMenuVisible">
      <div class="menu-section">
        <a @click="goUserPage()">
          <div class="user-page">
            <i class="iconfont icon-user"></i>
            {{ userPageText }}
          </div>
        </a>
      </div>
      <div class="menu-section menu-links">
        <a href="/newPhotos">
          <div class="head-bar-menu-item">图库</div>
        </a>
        <a href="https://blog.togaphotos.com">
          <div class="head-bar-menu-item">关于</div>
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  background: var(--color-toga);
  width: 100%;
  color: white;
  transition: all 0.5s ease;
}

.head-bar {
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
  background: var(--color-toga);
  padding: 1.5em 25px;
  z-index: 999;
}

.head-bar-menu div {
  line-height: 1em;
}

.menu-section {
  margin-bottom: 1.5em;
}

.menu-links {
  display: flex;
  justify-content: space-around;
  gap: 1.5em;
}

.head-bar-menu-item {
  font-size: 1.1rem;
  line-height: 1em;
  color: white;
  padding: 0.8em 0;
  text-align: center;
}

.user-page {
  font-weight: bolder;
  font-size: 1.1rem;
  padding: 0.8em 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5em;
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

  .nav-links {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    transition: background-color 0.3s;
    border-radius: 4px;
    white-space: nowrap;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .head-bar-mobile {
    display: none;
  }

  .head-bar-menu {
    display: none;
  }
}

@media only screen and (max-width: 701px) {
  .head-bar-desk {
    display: none;
  }

  .head-bar-mobile {
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
