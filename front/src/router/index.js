// // Composables
// import { createRouter, createWebHistory } from 'vue-router'

// const routes = [
//   {
//     path: '/',
//     component: () => import('@/views/Home.vue'),
//     children: [
//       {
//         path: '',
//         name: 'Home',
//         component: () => import('@/views/Home.vue'),
//       },
//       {
//         path: 'chat',
//         name: 'Chat',
//         component: () => import('@/views/Chat.vue'),
//       },
//     ],
//   },
// ]

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes,
// })

// export default router

const Home = () => import('@/views/Home.vue')
const Chat = () => import('@/views/Chat.vue')
// const Default = () => import('@/layouts/default/Default.vue')
// const Details = () => import('@/views/Details.vue')

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

