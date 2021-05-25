import Vue from "vue";
import Vuetify from "vuetify";
import colors from "vuetify/lib/util/colors";
import VuetifyFormBuilder from "vuetify-automatic-forms";

Vue.use(Vuetify);
Vue.use(VuetifyFormBuilder);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    themes: {
      light: {
        primary: "#0193CC",
        secondary: colors.blueGrey,
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00",
        vts_btn: colors.teal,
      },
    },
  },
});
