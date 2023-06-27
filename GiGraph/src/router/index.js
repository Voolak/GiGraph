const Home = () => import('@/views/Home.vue')
const Chat = () => import('@/views/Chat.vue')

const router = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home', component: Home, name: 'Home',
  },
  {
    path: '/chat', component: Chat, name: 'Chat',
  },
]

export default router

