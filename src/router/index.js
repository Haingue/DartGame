import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: "/",
            name: "Home",
            component: () => import('../view/Home')
        },
        {
            path: "/setup/game",
            name: "SetupGame",
            component: () => import('../view/SetupGame')
        },
        {
            path: "/game",
            name: "Game",
            component: () => import('../view/Game')
        }
    ]
})