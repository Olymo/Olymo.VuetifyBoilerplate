<template>
      <component v-bind:is="layout">
        <slot />
      </component>
</template>

<script>
import { isAuthorized } from "./util/user";

const Layout = () =>
  import(/* webpackChunkName: "layout-default" */ "./layouts/Layout");
// const BaseLayout = () =>
//   import(/* webpackChunkName: "layout-default" */ "./layouts/BaseLayout");
// const FrontLayout = () =>
//   import(
//     /* webpackChunkName: "layout-no-navigation"*/ "./layouts/FrontLayout"
//   );

export default {
  components: {    
    Layout,
    // BaseLayout,
    // FrontLayout
  },

  name: "App",

  data: () => ({
    isAuthorized: false,
    layout: "layout"
  }),
  // computed: {
  //   layout() {
  //     return "layout";
  //     return `${this.$route.meta.layout || "front"}-layout`;
  //   },
  // },  
  created() {
    this.isAuthorized = isAuthorized();
  }
};
</script>
