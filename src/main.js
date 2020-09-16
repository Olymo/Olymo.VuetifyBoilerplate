import Vue from 'vue'
import router from '@router'
import store from '@state/store'
import vuetify from '@plugins/vuetify'
import App from './app.vue'

// Globally register all '_base-' prefixed components
import '@components/_globals'

// Do not warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV == 'production'

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
