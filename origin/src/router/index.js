import { createRouter, createWebHistory } from 'vue-router'
import { BASE_URL } from "@/constants/base"
import routes from './routes'

const router = createRouter({
    history: createWebHistory(BASE_URL),
    routes
})

export default router
