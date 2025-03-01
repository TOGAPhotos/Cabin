import { createRouter, createWebHistory } from 'vue-router'
import userInfoStore from '@/stores/userInfo'
import Permission from '../utils/permission'
import { ElMessage } from 'element-plus'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/user/RegisterView.vue'
import PhotoView from '@/views/photo/PhotoView.vue'
import SearchView from '@/views/photo/SearchView.vue'
import LoginView from '@/views/user/LoginView.vue'
import RejectList from '@/views/user/RejectList.vue'
import UploadView from "@/views/photo/UploadView.vue";
import Page404 from "@/views/other/Page404.vue";
import Tos from "@/views/other/Tos.vue";
import UploadList from "@/views/user/UploadList.vue";

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path:'/register',
      name:'register',
      component: RegisterView
    },
    {
      path:'/photo/:id',
      name:'photo',
      component: PhotoView
    },
    {
      path:'/search',
      name:'search',
      component: SearchView
    },
    {
      path:'/login',
      name:'login',
      component: LoginView
    },
    {
      path:'/myself',
      name:'myself',
      component: () => import('@/views/user/MyselfView.vue')
    },
    {
      path:'/upload',
      name:'upload',
      component: UploadView
    },
    {
      path:'/queue',
      children:[
        {
          path:'reject',
          name:'reject-list',
          component: RejectList
        },
        {
          path:'upload',
          name:'upload-queue',
          component:UploadList
        }
      ]
    },
    {
      path:'/user/:id',
      name:'user',
      component: () => import('@/views/user/UserView.vue')
    },
    {
      path:'/about',
      name:'about',
      component: () => import('@/views/other/About.vue')
    },
    {
      path:'/privacy',
      name:'privacy',
      component: () => import("@/views/other/Privacy.vue")
    },
    {
      path:"/tos",
      name:'Tos',
      component: Tos
    },
    {
      path:'/:pathMatch(.*)*',
      name:'not-found',
      component: Page404
    }
  ]
})

router.beforeEach((to, from, next) => {
  if( !to.meta?.permission ){
    return next()
  }

  const user = userInfoStore()
  if(!user.isLoggedIn){
    ElMessage.error('未登录用户无法访问');
    return next('/')
  }

  if( !Permission.check(to.meta.permission,user.permission) ){
    ElMessage.error('无权限访问')
    return next('/')
  }

  return next();
})

export default router
