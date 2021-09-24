<template>
  <div>
    <v-container>
      <div class="row">
        <div class="col-md-3 col-sm-3 col-xs-12">
          <filters @update="onFiltersUpdate"></filters>
        </div>
        <div class="col-md-9 col-sm-9 col-xs-12">
          <v-row dense>
            <v-col cols="12" sm="8" class="pl-6 pt-6">
              <small> {{ this.itemsCount }} </small>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                class="pa-0"
                v-model="sortBy"
                :items="sortOptions"
                item-text="text"
                item-value="value"
                style="margin-bottom: -20px"
                outlined
                dense
                @change="onSortByUpdate"
              ></v-select>
            </v-col>
          </v-row>

          <v-divider></v-divider>

          <div class="row text-center" style="min-height: 55em">
            <div
              class="col-md-3 col-sm-6 col-xs-12"
              :key="product.id"
              v-for="product in products"
            >
              <product-card
                :id="product.id"
                :category="product.category"
                :name="product.name"
                :price="product.price"
                :totalAvailable="product.totalAvailable"
                :brand="product.brand"
                :image="product.productImages[0].imageSource"
              ></product-card>
            </div>
          </div>
          <v-divider></v-divider>

          <div class="text-center my-2">
            <v-pagination
              v-model="pagination.currentPage"
              :length="pagination.totalPages"
              @input="handlePageChange"
            ></v-pagination>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template> 

<script>
import ProductCard from "../components/products/ProductCard.vue";
import Filters from "../components/products/Filters.vue";

export default {
  components: {
    ProductCard,
    Filters,
  },
  data: () => ({
    sortBy: "",
    search: {
      categoryId: null,
      brandIds: [],
    },
    products: [],
    pagination: {},
    sortOptions: [
      {
        text: "Default",
        value: "",
      },
      {
        text: "Price: Low to High",
        value: "Price.Asc",
      },
      {
        text: "Price: High to Low",
        value: "Price.Desc",
      },
      {
        text: "Name: Ascending",
        value: "Name.Asc",
      },
      {
        text: "Name: Descending",
        value: "Name.Desc",
      },
    ],
  }),
  created() {
    this.searchProducts(1);
  },
  methods: {
    handlePageChange(page) {
      this.searchProducts(page);
    },
    onFiltersUpdate() {
      this.searchProducts(1);
    },
    onSortByUpdate() {
      this.searchProducts(this.pagination.currentPage);
    },
    searchProducts(page) {
      this.$http
        .get(
          "products?paginate=true&perPage=8&page=" +
            page +
            (this.sortBy != "" ? "&SortBy=" + this.sortBy : ""),
          {
            params: this.prepareSeachObject(),
          }
        )
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
    prepareSeachObject() {
      let params = this.search;
      if (params.brandIds.length) {
        let urlParams = new URLSearchParams();
        if (params.categoryId != null) {
          urlParams.append("categoryId", params.categoryId);
        }
        for (let id of params.brandIds) {
          urlParams.append("brandIds", id);
        }
        return urlParams;
      }
      return params;
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