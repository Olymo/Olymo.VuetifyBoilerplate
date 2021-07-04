<template>
      <component v-bind:is="layout">
        <slot />
      </component>
</template>

<script>
import { isAuthorized } from "./util/user";

const BaseLayout = () =>
  import(/* webpackChunkName: "layout-default" */ "./layouts/BaseLayout");
const NoNavigationLayout = () =>
  import(
    /* webpackChunkName: "layout-no-navigation"*/ "./layouts/NoNavigationLayout"
  );

export default {
  components: {
    NoNavigationLayout,
    BaseLayout,
  },

  name: "App",

  data: () => ({
    isAuthorized: false,
  }),
  computed: {
    layout() {
      return `${this.$route.meta.layout || "base"}-layout`;
    },
  },
  mounted() {
    // this.$http.get("account/CheckAuthorization")
    //   .then((r) => {
    //     console.log(r);
    //   });
  },
  created() {
    this.isAuthorized = isAuthorized();
  }
};
</script>
