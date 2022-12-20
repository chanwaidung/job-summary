export const routes = [
    {
        path: '/',
        name: 'Home',
        component: ()=> import('@/views/home/index.vue'),
    },
    {
        path: '/draw',
        name: 'Draw',
        component: ()=> import('@/views/draw/draw.vue'),
    }
]

export default routes
