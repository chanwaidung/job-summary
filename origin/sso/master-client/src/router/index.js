import { createRouter,createWebHistory } from 'vue-router'
import {PROGRAM_ROUTER_URL} from "../constants/base";
import {routes} from "./routes";

const router = createRouter({
    history: createWebHistory(PROGRAM_ROUTER_URL),
    routes
})

export default router
