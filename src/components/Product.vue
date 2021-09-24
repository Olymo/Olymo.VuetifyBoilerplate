<template>
  <div class="mt-12">
    <v-container>
      <div class="row">
        <div class="col-md-5 col-sm-5 col-xs-12">
          <v-carousel>
            <v-carousel-item
              v-for="item in product.productImages"
              :key="item.id"
              :src="baseUrl + '/ProductImages/' + item.imageSource"
            >
            </v-carousel-item>
          </v-carousel>
        </div>

        <div class="col-md-7 col-sm-7 col-xs-12">
          <div class="pl-6">
            <p class="display-1 mb-0">{{ product.name }}</p>
            <v-card-actions class="pa-0">
              <p class="headline font-weight-light pt-3">
                ${{ product.price }}
              </p>
              <v-spacer></v-spacer>
              <v-rating
                v-model="rating"
                class=""
                background-color="warning lighten-3"
                color="warning"
                dense
              ></v-rating>
              <span class="body-2 font-weight-thin"> 25 REVIEWS</span>
            </v-card-actions>
            <div style="min-height: 15em">
              <p class="subtitle-1 font-weight-thin">
                {{ product.description }}
              </p>
              <h4 class="specs-header">Additional Details</h4>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in product.productAttributes"
                      :key="item.id"
                    >
                      <td>{{ item.name }}</td>
                      <td>{{ item.value }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
            <div>
              <v-btn class="primary white--text" outlined tile dense
                ><v-icon>mdi-cart</v-icon> ADD TO CART</v-btn
              >
            </div>
          </div>
        </div>
      </div>
          <!-- <div v-for="item in product.productAttributes" :key="item.id">
            <p class="title">{{ item.name }}</p>
            <span>{{ item.value }}</span>
          </div> -->
      <div class="row">
        <div class="col-sm-12 col-xs-12 col-md-12">
          <v-card-text class="pa-0 pt-4 mt-15" tile outlined>
            <p class="subtitle-1 font-weight-light pt-3 text-center">
              YOU MIGHT ALSO LIKE
            </p>
            <v-divider></v-divider>
            <div class="row text-center">
              <div
                class="col-md-2 col-sm-4 col-xs-12 text-center"
                v-for="item in this.latestProducts"
                :key="item.id"
              >
                <v-hover v-slot:default="{ hover }" open-delay="200">
                  <v-card :elevation="hover ? 16 : 2" style="min-height: 28em">
                    <v-img
                      class="white--text align-end"
                      height="200px"
                      :src="baseUrl + '/ProductImages/' + item.images[0]"
                    >
                    </v-img>
                    <v-card-title style="min-height: 5em">
                      {{ item.name }}
                    </v-card-title>

                    <v-card-text class="text--primary text-center">
                      <div>$ {{ item.price }}</div>
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
        </div>
      </div>
    </v-container>
  </div>
</template>
<script>
import translate from '../util/genTable/multilanguageHelper.js'

export default {
  data() {
    return {
      rating: 4.5,
      breadcrums: [
        {
          text: "Home",
          disabled: false,
          href: "breadcrumbs_home",
        },
        {
          text: "Clothing",
          disabled: false,
          href: "breadcrumbs_clothing",
        },
        {
          text: "T-Shirts",
          disabled: true,
          href: "breadcrumbs_shirts",
        },
      ],
      item: 5,
      items: [
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
          title: "Lorem ipsum dolor?",
          subtitle:
            "<span class='text--primary'>Ali Connors</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Tincidunt arcu non sodales neque sodales ut etiam. Lectus arcu bibendum at varius vel pharetra. Morbi tristique senectus et netus et malesuada.\n" +
            "\n",
        },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
          title:
            'Lorem ipsum dolor <span class="grey--text text--lighten-1">4</span>',
          subtitle:
            "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
        },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
          title: "Lorem ipsum dolor",
          subtitle:
            "<span class='text--primary'>Sandra Adams</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
          title: "Lorem ipsum dolor",
          subtitle: "",
        },
        {
          avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
          title: "Lorem ipsum dolor",
          subtitle:
            "<span class='text--primary'>Britta Holt</span> &mdash; Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        },
      ],
      latestProducts: [],
      product: [],
    };
  },
  computed: {
    baseUrl: function () {
      return process.env.VUE_APP_BACKEND_DOMAIN;
    },
  },
  beforeCreate: function () {
    this.$http
      .get("products/" + this.$route.params.id)
      .then((res) => {
        this.product = res.data;
      })
      .catch((err) => {
        console.log(err);
        this.$router.push({
          name: "404",
        });
      });

    this.$http
      .get("lookup/getlatestproducts?take=6&excludeId=" + this.$route.params.id)
      .then((response) => {
        this.latestProducts = response.data;
      })
      .catch((err) => console.log(err));
  },
};
</script>

<style>
  .specs-header{
    margin-left: 15px;
    margin-top: 50px;
  }

  table{
    margin: 0px 0px 30px;
  }
</style>