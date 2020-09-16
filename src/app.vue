<script>
import appConfig from '@src/app.config'

export default {
  page: {
    // All subcomponent titles will be injected into this template.
    titleComponent(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title}` | `${appConfig.title}` : appConfig.title
    },
  },
  created() {
    this.$vuetify.theme.dark = true
  },
}
</script>

<template>
  <div id="app">
    <!--
      Even when routes use the same component, treat them
      as distinct and create the component again.
    -->
    <v-app>
      <RouterView :key="$route.fullPath" />
    </v-app>
  </div>
</template>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
// Normalize default styles across browsers.
@import '~normalize.css/normalize.css';
// Style loading bar between pages.
@import '~nprogress/nprogress.css';
// Design variables and utilities from src/design.
</style>
