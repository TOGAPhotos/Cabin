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
      component: () => import('../views/HomeView.vue')
    },
    {
      path:'/register',
      name:'register',
      component: () => import('@/views/user/RegisterView.vue')
    },
    {
      path:'/photo/:id',
      name:'photo',
      component: () => import('@/views/photo/PhotoView.vue')
    },
    {
      path:'/search',
      name:'search',
      component: () => import('@/views/photo/SearchView.vue')
    },
    {
      path:'/myself',
      name:'myself',
      component: () => import('@/views/user/MyselfView.vue')
    },
    {
      path:'/upload',
      name:'upload',
      component: () => import('@/views/photo/UploadView.vue')
    },
    {
      path:'/user/:id',
      name:'user',
      component: () => import('@/views/user/UserView.vue')
    },
    {
      path:'/privacy',
      name:'privacy',
      component: () => import("@/views/other/Privacy.vue")
    },
    {
      path:"/user-agreement",
      name:'user-agreement',
      component: () => import('@/views/other/UserAgreementView.vue')
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
