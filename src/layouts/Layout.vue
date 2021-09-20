<template>
  <v-app id="inspire">
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="primary"
      dark
    >
      <v-toolbar-title class="col-md-6 col-sm-10">
        <a
          class="white--text"
          style="text-decoration: none"
          @click="() => $router.push({ name: 'home' })"
          ><v-icon>mdi-truck</v-icon>&nbsp; Boilerplate</a
        >
      </v-toolbar-title>

      <v-spacer />

      <Language class="col-md-2 col-sm-1 mr-md-10" />

      <AccountMenuIcon></AccountMenuIcon>

      <v-btn
        v-show="this.isUserLoggedIn"
        @click="
          () =>
            $router.push({
              name: 'cart',
            })
        "
        icon
      >
        <v-badge
          :content="this.cartItemsNumber"
          :value="this.cartItemsNumber"
          color="green"
          overlap
        >
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-bottom-navigation :value="activeBtn" color="primary" horizontal>
        <div
          class="my-auto"
          v-for="(menuItem, index) of mainNavigation"
          :key="index"
        >
          <v-btn
            v-if="
              menuItem.subItems.length == 0 &&
              (menuItem.shouldBeLoggedIn == String(isUserLoggedIn) ||
                menuItem.shouldBeLoggedIn == 'false')
            "
            x-large
            dark
            text
            tile
            class="text-body-1"
            @click="
              () =>
                $router.push({
                  name: menuItem.routeName,
                })
            "
          >
            {{ translateName(menuItem.name, menuItem.translatePath) }}
          </v-btn>
          <v-menu
            v-else-if="
              menuItem.subItems.length > 0 &&
              (menuItem.shouldBeLoggedIn == String(isUserLoggedIn) ||
                menuItem.shouldBeLoggedIn == 'false')
            "
            open-on-hover
            :close-on-content-click="true"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-btn small v-on="on" dark text tile class="text-body-1">
                {{ translateName(menuItem.name, menuItem.translatePath) }}
              </v-btn>
            </template>
            <v-list dense class="text-caption">
              <v-list-item
                v-for="(subMenuItem, subMenuIndex) of menuItem.subItems"
                :key="subMenuIndex"
                exact
                @click="handleSubMenuItemRoute(subMenuItem)"
              >
                <v-list-item-content>{{
                  subMenuItem.name
                }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <div class="my-auto">
          <v-menu
            v-if="isAdmin"
            open-on-hover
            :close-on-content-click="true"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-btn small v-on="on" dark text tile class="text-body-1">
                Admin
              </v-btn>
            </template>
            <v-list dense class="text-caption">
              <v-list-item
                v-for="(menuItem, index) of adminNavigation"
                :key="index"
                exact
                @click="
                  () =>
                    $router.push({
                      name: 'admin',
                      params: menuItem.params,
                    })
                "
              >
                <v-list-item-content>{{ menuItem.title }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-bottom-navigation>

      <router-view :key="$route.path"></router-view>
    </v-main>
    <v-footer :padless="true">
      <v-card flat tile width="100%" class="secondary white--text text-center">
        <v-card-text>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-home</v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-email</v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-calendar</v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-delete</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet.
          Mauris cursus commodo interdum. Praesent ut risus eget metus luctus
          accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim
          a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula
          lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus
          iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum
          tempor vel ut orci. Orci varius natoque penatibus et magnis dis
          parturient montes, nascetur ridiculus mus.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ this.currentYear }} — <strong> Boilerplate Template </strong>
        </v-card-text>
      </v-card>
    </v-footer>
    <v-textarea v-show="false"></v-textarea>
  </v-app>
</template>
<script>
import AccountMenuIcon from "../components/AccountMenuIcon.vue";
import Language from "../components/Language.vue";
import navigation from "../resource/navigation.json";
import { isAuthorized, isAdmin, allowedUseCaseIds } from "../util/user";
import translate from "../util/genTable/multilanguageHelper.js";
import EventBus from "../event-bus.js";

export default {
  components: {
    AccountMenuIcon,
    Language,
  },
  data() {
    return {
      activeBtn: 0,
      cartItemsNumber: 0,
      isUserLoggedIn: isAuthorized(),
      isAdmin: isAdmin(),
      allowedUseCaseIds: allowedUseCaseIds(),
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear() + ".";
    },
    mainNavigation() {
      return navigation.mainNavigation;
    },
    adminNavigation() {
      return navigation.adminCRUD.filter((x) =>
        this.allowedUseCaseIds.includes(x.params.useCase)
      );
    },
  },
  methods: {
    translateName(toTranslate, source) {
      return translate(toTranslate, source);
    },
  },
  created() {
    EventBus.$on("logged", () => {
      this.isUserLoggedIn = isAuthorized();
      this.isAdmin = isAdmin();
      this.allowedUseCaseIds = allowedUseCaseIds();
    });
    EventBus.$on("logout", () => {
      this.isUserLoggedIn = isAuthorized();
      this.isAdmin = false;
      this.allowedUseCaseIds = [];
    });
  },
  // beforeMount() {
  //   this.$http.get("cartItems/getTotalNumber")
  //   .then(response => {
  //     if(response.data.totalNumber > 0) {
  //       this.cartItemsNumber = response.data.totalNumber
  //     }
  //   })
  //   .catch(err => console.log(err));
  // }
};
</script>

<style>
.padding-bottom {
  padding-bottom: 100px;
}
</style>