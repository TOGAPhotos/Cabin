import { addNoIndex, removeNoIndex } from "@/router/no-index";
import userInfoStore from "@/stores/userInfo";
import { ElMessage } from "element-plus";
import { createRouter, createWebHistory } from "vue-router";
import Permission from "../utils/permission";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/user/RegisterView.vue"),
    },
    {
      path: "/photo/:id",
      name: "photo",
      component: () => import("@/views/photo/PhotoView.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("@/views/photo/SearchView.vue"),
    },
    {
      path: "/editorChoice",
      name: "editorChoice",
      component: () => import("@/views/photo/EditorChoice.vue"),
    },
    {
      path: "/newPhotos",
      name: "newPhotos",
      component: () => import("@/views/photo/NewPhotosView.vue"),
    },
    {
      path: "/login",
      name: "login",
      meta: { hideHeader: true },
      component: () => import("@/views/user/LoginView.vue"),
    },
    {
      path: "/myself",
      name: "myself",
      meta: { permission: "USER" },
      component: () => import("@/views/user/MyselfView.vue"),
    },
    {
      path: "/upload",
      name: "upload",
      meta: { permission: "USER" },
      component: () => import("@/views/photo/UploadView.vue"),
    },
    {
      path: "/queue",
      meta: { permission: "USER" },
      children: [
        {
          path: "reject",
          name: "reject-list",
          component: () => import("@/views/user/RejectList.vue"),
        },
        {
          path: "upload",
          name: "upload-queue",
          component: () => import("@/views/user/UploadList.vue"),
        },
      ],
    },
    {
      path: "/user/:id",
      name: "user",
      component: () => import("@/views/user/UserView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/other/About.vue"),
    },
    {
      path: "/privacy",
      name: "privacy",
      component: () => import("@/views/other/Privacy.vue"),
    },
    {
      path: "/tos",
      name: "Tos",
      component: () => import("@/views/other/Tos.vue"),
    },
    {
      path: "/maintenance",
      name: "maintenance",
      meta: { hideHeader: true },
      component: () => import("@/views/other/Maintenance.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/other/Page404.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === "/search") {
    addNoIndex();
  } else {
    removeNoIndex();
  }

  if (!to.meta?.permission) {
    return next();
  }

  const user = userInfoStore();
  if (!user.isLoggedIn) {
    ElMessage.error("未登录用户无法访问");
    return next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  if (!Permission.check(<string>to.meta?.permission, user.permission)) {
    ElMessage.error("无权限访问");
    return next("/");
  }

  return next();
});

export default router;
