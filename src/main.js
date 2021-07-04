import Vue from "vue";
import App from "./App.vue";
import router from './plugins/router';
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n/i18n";
import "./plugins/vee-validate";
import httpClient from "./util/httpClient";
import VSelectAll from '@/components/customInputs/VSelectAll'
import UseCasesInput from '@/components/customInputs/UseCasesInput'

Vue.component('VSelectAll', VSelectAll)
Vue.component('v-use-cases-input', UseCasesInput)

Vue.config.productionTip = false;

Vue.prototype.$formBuilderAxios = httpClient;
Vue.prototype.$http = httpClient;

new Vue({
  router,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
