import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

// Boostrap imports
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// Font awesome imports
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import './registerServiceWorker'

Vue.config.productionTip = false

window.App = new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
