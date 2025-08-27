import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AIChat from '@/views/AIChat.vue'
import ComfortSimulator from '@/views/ComfortSimulator.vue'
import CustomerService from '@/views/CustomerService.vue'
import ChatPDF from '@/views/ChatPDF.vue'
import GameChat from '@/views/GameChat.vue'
import Home from '@/views/Home.vue'
import UserLoginPage from '@/views/user/UserLoginPage.vue'
import UserRegisterPage from '@/views/user/UserRegisterPage.vue'
import UserManangePage from '@/views/admin/UserManangePage.vue'

const routes: Array<RouteRecordRaw> = [

  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
    {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/ai/ai-chat',
    name: 'AIChat',
    component: AIChat
  },
  {
    path: '/ai/comfort-simulator',
    name: 'ComfortSimulator',
    component: ComfortSimulator
  },
  {
    path: '/ai/customer-service',
    name: 'CustomerService',
    component: CustomerService
  },
  {
    path: '/ai/chat-pdf',
    name: 'ChatPDF',
    component: ChatPDF
  },
  {
    path: '/ai/game',
    name: 'game',
    component: GameChat
  },
  {
    path: '/user/login',
    name: 'login',
    component: UserLoginPage
  },
  {
    path: '/user/register',
    name: 'register',
    component: UserRegisterPage
  },
  {
    path: '/admin/manage',
    name: 'currentUser',
    component: UserManangePage
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
