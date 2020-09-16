import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'
import SimpleCrud from './components/SimpleCrud'
import Table from './store/table'

Vue.config.productionTip = false

var routes = [
  { path : "/simple-crud", component: SimpleCrud }
]

var router = new VueRouter({
  routes,
  mode: 'history'
})

Vue.use(VueRouter)
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    table: Table
  }
})

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
