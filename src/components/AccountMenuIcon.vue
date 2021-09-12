<template>
  <div class="text-center">
    <v-menu
      open-on-hover
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
        icon>
            <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in this.accountLinks"
          :key="index"
          exact
          @click="handleSubMenuItemRoute(item)"
        >
          <v-list-item-title>{{translateName(item.name, item.translatePath)}}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import navigation from '../resource/navigation.json'
import { isAuthorized } from '../util/user'
import EventBus from '../event-bus.js'
import translate from '../util/genTable/multilanguageHelper.js'

export default {
  data() {
    return {
        isUserLoggedIn: isAuthorized().toString(),
        accountLinks: []
    }
  },
  methods: {
    handleSubMenuItemRoute(subMenuItem) {
        this.$router.push({
            name: subMenuItem.routeName,
        })
    },
    translateName(toTranslate, source) {
      return translate(toTranslate, source)
    }
  },
  created() {
    EventBus.$on('logged', () => {
      this.isUserLoggedIn = isAuthorized().toString();
      this.accountLinks = navigation.accountLinks.filter(x => x.shouldBeLoggedIn == this.isUserLoggedIn);
    })

    EventBus.$on('logout', () => {
    this.isUserLoggedIn = isAuthorized().toString()
    this.accountLinks = navigation.accountLinks.filter(x => x.shouldBeLoggedIn == this.isUserLoggedIn);
  })
  },
  beforeMount() {
    this.accountLinks = navigation.accountLinks.filter(x => x.shouldBeLoggedIn == this.isUserLoggedIn);
  }
}

</script>