<template>
  <div>
    <v-carousel hide-delimiters>
      <v-carousel-item
        v-for="(item, index) in this.sliderItems"
        :src="require('../assets/img/home/' + item.imgPath)"
        :key="index"
      >
        <v-row class="fill-height" align="center" justify="center">
          <div class="display-2 white--text pl-5 pr-5 hidden-sm-only">
            <strong>{{ item.title }} </strong>
          </div>
          <br />
        </v-row>
      </v-carousel-item>
    </v-carousel>
    <div class="pl-4 pr-4 row pt-10">
      <div
        class="col-md-4 col-sm-4 col-xs-12"
        v-for="item in this.categories"
        :key="item.id"
      >
        <v-card outlined>
          <v-img
            :src="require('../assets/img/home/' + item.imgPath)"
            class="white--text align-center"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="300px"
          >
            <h1 class="text-center font-size">{{ item.text }}</h1>
            <div class="text-center mt-2">
              <v-btn
                class="white--text caption"
                text
                @click="
                  () => $router.push({ name: 'products', params: item.id })
                "
                >SHOP NOW
                <v-icon class="white--text caption"
                  >mdi-arrow-right</v-icon
                ></v-btn
              >
            </div>
          </v-img>
        </v-card>
      </div>
    </div>
    <v-container>
      <v-row no-gutters>
        <v-col :cols="12">
          <v-card-text class="" tile outlined>
            <v-card-title class="subheading">{{ text.latest }}</v-card-title>
            <v-divider></v-divider>
            <div class="row">
              <div
                class="col-12 col-md-3 col-sm-6 col-xs-6 text-center"
                v-for="item in this.latestProducts"
                :key="item.id"
              >
                <v-hover v-slot:default="{ hover }" open-delay="200">
                  <v-card :elevation="hover ? 16 : 2">
                    <div class="gray-overlay">
                      <v-img
                        class="white--text align-end"
                        height="250px"
                        :src="baseUrl + '/ProductImages/' + item.images[0]"
                      >
                      </v-img>
                    </div>

                    <v-card-title class="black--text pt-5"
                      >{{ item.category }}
                    </v-card-title>

                    <v-card-text class="text--primary text-center">
                      <div>{{ item.name }}</div>
                    </v-card-text>

                    <div class="text-center">
                      <router-link
                        :to="{ name: 'product', params: { id: item.id } }"
                        style="text-decoration: none"
                      >
                        <v-btn class="ma-2" outlined color="info">
                          Explore
                        </v-btn>
                      </router-link>
                    </div>
                  </v-card>
                </v-hover>
              </div>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-card class="accent">
      <v-container>
        <v-row no-gutters>
          <v-col class="col-12 col-md-4 col-sm-12">
            <v-row>
              <v-col class="col-12 col-sm-3 pr-4" align="right">
                <v-icon class="display-2">mdi-truck</v-icon>
              </v-col>
              <v-col class="col-12 col-sm-9 pr-4 content-info">
                <h3 class="font-weight-light">{{ text.shippingText }}</h3>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12 col-md-4 col-sm-12">
            <v-row>
              <v-col class="col-12 col-sm-3 pr-4" align="right">
                <v-icon class="display-2">mdi-cash</v-icon>
              </v-col>
              <v-col class="col-12 col-sm-9 pr-4 content-info">
                <h3 class="font-weight-light">{{ text.moneyText }}</h3>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12 col-md-4 col-sm-12">
            <v-row>
              <v-col class="col-12 col-sm-3 pr-4" align="right">
                <v-icon class="display-2">mdi-headset</v-icon>
              </v-col>
              <v-col class="col-12 col-sm-9 pr-4 content-info">
                <h3 class="font-weight-light">{{ text.supportText }}</h3>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import translate from "../util/genTable/multilanguageHelper.js";

export default {
  data() {
    return {
      sliderItems: [
        {
          imgPath: "slider0.jpg",
          title: translate("Sale up to 40% + Extra 10%", "slider"),
        },
        {
          imgPath: "slider1.jpg",
          title: translate("New autumn collection", "slider"),
        },
        {
          imgPath: "slider2.jpg",
          title: translate("Earn a bonus with online shopping", "slider"),
        },
      ],
      activeBtn: 1,
      categories: [
        {
          id: 1,
          text: translate("Watches", "home"),
          imgPath: "watches.jpg",
        },
        {
          id: 7,
          text: translate("Jewellery", "home"),
          imgPath: "jewellery.jpg",
        },
        {
          id: 12,
          text: translate("Bags", "home"),
          imgPath: "bags.jpg",
        },
      ],
      text: {
        shippingText: translate("Free shipping & return over $300", "home"),
        moneyText: translate("Money back guarantee", "home"),
        supportText: translate("24/7 Custom support +3816771723456", "home"),
      },
      latestProducts: [],
    };
  },
  computed: {
    baseUrl: function () {
      return process.env.VUE_APP_BACKEND_DOMAIN;
    },
  },
  beforeCreate: function () {
    this.$http
      .get("lookup/getlatestproducts")
      .then((response) => {
        this.latestProducts = response.data;
      })
      .catch((err) => console.log(err));
  },
};
</script>
<style>
.gray-overlay {
  background-color: rgba(88, 87, 87, 0.3);
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
.accent {
  padding: 30px 0px;
  margin-top: 100px;
  display: flex;
  align-items: center;
}

.content-info{
  display: flex;
  align-items: center;
}

</style>
