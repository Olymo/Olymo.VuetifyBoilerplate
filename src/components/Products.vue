<template>
  <div>
    <v-container>
      <div class="row">
        <div class="col-md-3 col-sm-3 col-xs-12">
          <filters></filters>
        </div>
        <div class="col-md-9 col-sm-9 col-xs-12">
          <v-breadcrumbs class="pb-0" :items="breadcrums"></v-breadcrumbs>

          <v-row dense>
            <v-col cols="12" sm="8" class="pl-6 pt-6">
              <small> {{ this.itemsCount }} </small>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                class="pa-0"
                v-model="select"
                :items="options"
                style="margin-bottom: -20px"
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>

          <div class="text-center my-2">
            <v-pagination
              v-model="pagination.currentPage"
              :length="pagination.totalPages"
              @input="handlePageChange"
            ></v-pagination>
          </div>

          <v-divider></v-divider>

          <div class="row text-center">
            <div
              class="col-md-3 col-sm-6 col-xs-12"
              :key="product.id"
              v-for="product in products"
            >
              <product
                :id="product.id"
                :category="product.category"
                :name="product.name"
                :price="product.price"
                :totalAvailable="product.totalAvailable"
                :brand="product.brand"
                :image="product.productImages[0].imageSource"
              ></product>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import Product from "../components/products/ProductCard.vue";
import Filters from "../components/products/Filters.vue";

export default {
  components: {
    Product,
    Filters,
  },
  data: () => ({
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
    select: "Popularity",
    options: [
      "Default",
      "Popularity",
      "Relevance",
      "Price: Low to High",
      "Price: High to Low",
    ],
    search: null,
    products: [],
    pagination: {},
  }),
  created() {
    this.searchProducts(1);
  },
  methods: {
    handlePageChange(value) {
      this.searchProducts(value);
    },
    searchProducts(page) {
      var keyword = keyword == "" ? null : keyword;

      this.$http
        .get("products?paginate=true&perPage=8&page=" + page)
        .then((res) => {
          var data = res.data;

          this.products = data.items;
          this.pagination = {
            currentPage: data.currentPage,
            itemsPerPage: data.itemsPerPage,
            totalCount: data.totalCount,
            totalPages: data.totalPages,
          };
        })
        .catch((err) => console.log(err));
    },
  },
  computed: {
    itemsCount() {
      var n1 =
        this.pagination.currentPage == 1
          ? 1
          : (this.pagination.currentPage - 1) * this.pagination.itemsPerPage +
            1;
      var n2 =
        this.pagination.currentPage == this.pagination.totalPages
          ? this.pagination.totalCount
          : this.pagination.currentPage * this.pagination.itemsPerPage;
      return `Showing ${n1}-${n2} of total ${this.pagination.totalCount} products`;
    },
  },
};
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}
</style>