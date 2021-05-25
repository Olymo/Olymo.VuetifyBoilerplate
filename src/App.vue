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
      <rest-crud-page page="test"></rest-crud-page>
      <p>{{ $t("welcomeMessage") }}</p>
    </v-main>
  </v-app>
</template>

<script>
import RestCrudPage from "./components/rest-crud/RestCrudPage.vue";
import "./assets/custom.css";
export default {
  components: {
    RestCrudPage,
  },
  name: "App",

  data: () => ({
    //
  }),
  mounted() {
    this.$http.get("test").then((r) => {
      console.log(r);
    });
  },
};
</script>
