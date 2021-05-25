import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n/i18n";
import "./plugins/vee-validate";
import httpClient from "./util/httpClient";

Vue.config.productionTip = false;

Vue.prototype.$formBuilderAxios = httpClient;
Vue.prototype.$http = httpClient;

new Vue({
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
