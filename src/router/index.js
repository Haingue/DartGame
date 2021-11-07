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
            path: "/game/simplecriquet-game",
            name: "SimpleCriquetGame",
            component: () => import('../view/SimpleCriquetGame')
        },
        {
            path: "/game/crazycriquetmasterout-game",
            name: "CrazyCriquetMasterOutGame",
            component: () => import('../view/CrazyCriquetMasterOutGame')
        }
    ]
})