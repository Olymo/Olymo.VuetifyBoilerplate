<template>
  <v-card outlined>
    <v-card-title> Filters </v-card-title>
    <v-divider></v-divider>
    <template>
      <v-card-title>Category</v-card-title>
      <v-treeview
        :items="categories"
        :open.sync="open"
        :active.sync="active"
        :selected-color="'#fff'"
        activatable
        dense
        @update:active="onCategoryChange"
      ></v-treeview>
    </template>
    <v-divider></v-divider>
    <v-card-title class="pb-0">Brand</v-card-title>
    <v-container class="pt-0" fluid>
      <v-checkbox
        v-for="item in brands"
        :key="item.id"
        :label="item.name"
        :value="item.id"
        v-model="selectedBrands"
        hide-details
        dense
        @change="onBrandsChange"
      ></v-checkbox>
    </v-container>
    <v-divider></v-divider>
    <v-card-title>Price</v-card-title>
    <v-range-slider
      v-model="range"
      :max="max"
      :min="min"
      :height="10"
      class="align-center"
      dense
    ></v-range-slider>
    <v-row class="pa-2" dense>
      <v-col cols="12" sm="5">
        <v-text-field
          :value="range[0]"
          label="Min"
          outlined
          dense
          @change="$set(range, 0, $event)"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <p class="pt-2 text-center">TO</p>
      </v-col>
      <v-col cols="12" sm="5">
        <v-text-field
          :value="range[1]"
          label="Max"
          outlined
          dense
          @change="$set(range, 1, $event)"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-card>
</template>

<script>
export default {
  name: "Filters",
  data: () => ({
    active: [1],
    open: [1],
    range: [0, 10000],
    min: 0,
    max: 10000,
    categories: [],
    brandsWithProducts: [],
    brands: [],
    selectedBrands: [],
  }),
  methods: {
    onCategoryChange: function (selection) {
      this.selectedBrands = [];
      if (selection.length) {
        this.$http
          .get("Categories/GetCategoryBrands?id=" + selection[0])
          .then((res) => {
            this.brands = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.brands = this.brandsWithProducts;
      }

      if (selection.length) {
        this.$parent.search.categoryId = selection[0];
      } else {
        this.$parent.search.categoryId = null;
      }

      this.applyFilters();
    },
    onBrandsChange: function () {
      this.$parent.search.brandIds = this.selectedBrands;
      this.applyFilters();
    },
    applyFilters() {
      this.$emit("update");
    },
  },
  beforeCreate: function () {
    this.$http
      .get("categories/GetNestedCategories")
      .then((res) => {
        this.categories = res.data;
      })
      .catch((err) => {
        console.log(err);
      });

    this.$http
      .get("brands?WithProducts=true")
      .then((res) => {
        this.brands = res.data;
        this.brandsWithProducts = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style>
</style>