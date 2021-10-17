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
            props: true,
            component: () => import('../view/SetupGame')
        },
        {
            path: "/game/game1",
            name: "Game1",
            component: () => import('../view/Game1')
        },
        {
            path: "/game/tintinou-game",
            name: "TintinouGame",
            component: () => import('../view/TintinouGame')
        }
    ]
})