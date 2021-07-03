<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-row></v-row>
      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <!-- <Login v-if="isAuthorized == false" /> -->

      <Login />

      <Cart />

      <!-- <div>
        <rest-crud-page page="test"></rest-crud-page>
        <p>{{ $t("welcomeMessage") }}</p>

      </div> -->

    </v-main>
  </v-app>
</template>

<script>
import RestCrudPage from "./components/rest-crud/RestCrudPage.vue";
import Login from "./components/Login";
import Cart from './components/Cart';
import Register from "./components/Register";
import "./assets/custom.css";
import { isAuthorized } from './util/user';

export default {
  components: {
    RestCrudPage,
    Login,
    Register,
    Cart,
  },
  name: "App",

  data: () => ({
    isAuthorized: false,
  }),
  mounted() {
    // this.$http.get("api/account/CheckAuthorization")
    //   .then((r) => {
    //     console.log(r);
    //   });
  },
  created() {
    this.isAuthorized = isAuthorized();
  }
};
</script>
