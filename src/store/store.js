import Vue from "vue";
import Vuex from "vuex";

import * as example from "./stores/example";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    example,
    colors,
  },
  state: {},
  mutations: {},
});
