import { createRouter, createWebHistory } from 'vue-router'
import userInfoStore from '@/stores/userInfo'
import Permission from '../utils/permission'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: import('@/views/HomeView.vue')
    },
    {
      path:'/register',
      name:'register',
      component: import('@/views/user/RegisterView.vue')
    },
    {
      path:'/photo/:id',
      name:'photo',
      component: import('@/views/photo/PhotoView.vue')
    },
    {
      path:'/search',
      name:'search',
      component: import('@/views/photo/SearchView.vue')
    },
    {
      path:'/login',
      name:'login',
      component: import('@/views/user/LoginView.vue')
    },
    {
      path:'/myself',
      name:'myself',
      component: () => import('@/views/user/MyselfView.vue')
    },
    {
      path:'/upload',
      name:'upload',
      component: import('@/views/photo/UploadView.vue')
    },
    {
      path:'/queue',
      children:[
        {
          path:'reject',
          name:'reject-list',
          component: import('@/views/user/RejectList.vue')
        },
        {
          path:'upload',
          name:'upload-queue',
          component:import('@/views/user/UploadList.vue')
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
      component: import("@/views/other/Tos.vue")
    },
    {
      path:'/:pathMatch(.*)*',
      name:'not-found',
      component: import('@/views/other/Page404.vue')
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
