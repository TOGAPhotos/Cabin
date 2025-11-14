<script setup lang="ts">
import router from "@/router";
import userInfoStore from "@/stores/userInfo";
import ServerRequest from "@/utils/request";
import { ElNotification } from "element-plus";
import { reactive } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("邮件格式错误").trim().min(1),
  password: z.string("密码格式错误").trim().min(1),
});

type LoginForm = z.infer<typeof loginSchema>;

const loginForm = reactive<LoginForm>({
  email: "",
  password: "",
});

const backgroundImg = reactive({
  url: "https://cos-125-tp-cdn.794td.cn/photos/41687.jpg",
  status: "loading",
});
const user = userInfoStore();
const route = useRoute();

if (user.isLoggedIn) {
  router.replace("/");
}

// Preload background image
const preloadImage = () => {
  const img = new Image();
  img.onload = () => {
    backgroundImg.status = "loaded";
  };
  img.onerror = () => {
    backgroundImg.status = "error";
  };
  img.src = backgroundImg.url;
};

// Start loading image on component mount
preloadImage();

async function login() {
  // valid form
  const validation = loginSchema.safeParse(loginForm);
  if (!validation.success) {
    ElNotification.error({
      title: "输入有误",
      message: validation.error.issues.map((e) => e.message).join("; "),
    });
    return;
  }
  const loginRequest = new ServerRequest("POST", "/user/login", {
    email: loginForm.email,
    password: loginForm.password,
  });
  loginRequest.success = () => {
    const id = loginRequest.getData("id") as number;
    const username = loginRequest.getData("username") as string;
    const token = loginRequest.getData("token") as string;
    const expireTime = loginRequest.getData("expireTime") as number;
    const permission = loginRequest.getData("permission") as string;
    user.setUserInfo({
      id,
      username,
      email: loginForm.email,
      token,
      expireTime,
      permission,
    });
    return router.push(<string | undefined>route.query.redirect || "/");
  };
  loginRequest.error = (_, msg) => {
    ElNotification.error({
      title: "登录时发生错误",
      message: msg,
    });
  };
  await loginRequest.send();
}
</script>
<template>
  <div id="login-view" class="login-container">
    <!-- Blurred background layer for portrait mode -->
    <div
      v-if="backgroundImg.status === 'loaded'"
      class="background-blur"
      :style="{ backgroundImage: `url(${backgroundImg.url})` }"
    ></div>

    <!-- Dynamic background image (maintains aspect ratio) -->
    <div
      v-if="backgroundImg.status === 'loaded'"
      class="background-image"
      :style="{ backgroundImage: `url(${backgroundImg.url})` }"
    ></div>

    <!-- Login card -->
    <div
      class="login-card"
      :class="{ 'animate-in': backgroundImg.status === 'loaded' }"
    >
      <img
        id="login-logo-img"
        src="https://cos-125-tp-cdn.794td.cn/assets/n_logo_b.jpg"
        alt="Logo"
      />
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">邮箱:</label>
          <input type="text" id="username" v-model="loginForm.email" required />
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
          <!--        <div class="right-align">-->
          <!--          <a href="/forget">> 忘记密码</a>-->
          <!--        </div>-->
        </div>
        <div class="form-group" style="margin-top: 2em">
          <button type="submit" class="login-button">登录</button>
        </div>
      </form>
    </div>
  </div>
</template>
<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
}

/* Blurred background layer - fills entire screen */
.background-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(40px);
  transform: scale(1.1);
  z-index: -2;
}

/* Main background image - maintains aspect ratio */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.background-image::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.login-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3rem 2.5rem;
  width: 90vw;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 10;
  opacity: 0;
  transform: translateY(30px);
}

.login-card.animate-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

#login-logo-img {
  width: 70%;
  display: block;
  margin: 0 auto 2em auto;
  border-radius: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

input {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
}

input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.right-align {
  margin-top: 0.5rem;
  text-align: right;
}

.right-align a {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.right-align a:hover {
  color: #66b1ff;
}

button {
  width: 100%;
  border: none;
  padding: 12px 0;
  color: white;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  font-size: 18px;
  font-weight: 600;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .login-card {
    padding: 2rem 1.5rem;
    width: 95vw;
  }

  .login-card.animate-in {
    animation: fadeInUpMobile 2500ms ease-out forwards;
  }

  @keyframes fadeInUpMobile {
    0% {
      opacity: 0;
      transform: translateY(100px);
    }
    50% {
      opacity: 0.1;
      transform: translateY(25px);
    }
    75% {
      opacity: 0.5;
      transform: translateY(0px);
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
