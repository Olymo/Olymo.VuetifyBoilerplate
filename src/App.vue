<template>
      <component v-bind:is="layout">
        <slot />
      </component>
</template>

<script>
import { isAuthorized } from "./util/user";

const Layout = () =>
  import(/* webpackChunkName: "layout-default" */ "./layouts/Layout");

export default {
  components: {    
    Layout
  },
  name: "App",
  data: () => ({
    isAuthorized: false,
    layout: "layout"
  }),
  created() {
    this.isAuthorized = isAuthorized();
  }
};
</script>
