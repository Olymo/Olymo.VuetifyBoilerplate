<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      class="mx-auto"
      color="grey lighten-4"
      max-width="600"
      min-height="330px"
    >
      <v-img
        class="white--text align-end"
        :aspect-ratio="16 / 9"
        height="200px"
        :src="imageSource"
        alt="a" 
      >
        <v-card-title> {{ brand }} / {{ category }} </v-card-title>
        <v-expand-transition>
          <div
            v-if="hover"
            class="
              d-flex
              transition-fast-in-fast-out
              white
              darken-2
              v-card--reveal
              display-3
              white--text
            "
            style="height: 100%"
          >
            <v-btn v-if="hover" href="#" class="" outlined> View </v-btn>
          </div>
        </v-expand-transition>
      </v-img>
      <v-card-text class="text--primary">
        <div>
          <a href="#" style="text-decoration: none"> {{ name }} </a>
        </div>
        <div>$ {{ price }}</div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  computed: {
    imageSource() {
      return process.env.VUE_APP_BACKEND_DOMAIN + "/ProductImages/" + this.image;
    }
  },
  props: {
    id: Number,
    category: String,
    name: String,
    brand: String,
    price: Number,
    cover: {
      type: String,
      default: "https://i.stack.imgur.com/y9DpT.jpg",
    },
    totalAvailable: Number,
    image: String,
  },
};
</script>

<style>
</style>