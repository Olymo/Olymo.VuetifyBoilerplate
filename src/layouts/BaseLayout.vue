<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon
        @click.stop="(sidebarMenu = !sidebarMenu), (collapsed = true)"
      >
      </v-app-bar-nav-icon>
      <v-row></v-row>
      <v-spacer></v-spacer>
      <router-link v-if="!isAuthorized" :to="{ name: 'login' }" class="pl-5"
        ><v-icon>mdi-login</v-icon></router-link
      >
      <v-icon v-if="isAuthorized" @click.stop="logout">mdi-logout</v-icon>
    </v-app-bar>

    <sidebar-menu
      v-if="sidebarMenu"
      :menu="menu"
      :collapsed="collapsed"
      :theme="selectedTheme"
      :show-one-child="true"
      width="220px"
      :hideToggle="true"
      @toggle-collapse="onToggleCollapse"
      @item-click="onItemClick"
    >
      <template v-slot:header>
        <button
          class="vsm--toggle-btn"
          @click.stop="collapsed = !collapsed"
        ></button>
      </template>
    </sidebar-menu>

    <div
      :class="
        collapsed
          ? sidebarMenu
            ? 'padd1'
            : 'padd0'
          : !isOnMobile
          ? 'padd2'
          : 'padd1'
      "
    >
      <v-main>
        <router-view :key="$route.path"></router-view>
      </v-main>
    </div>

    <div
      v-if="isOnMobile && !collapsed"
      class="sidebar-overlay"
      @click="collapsed = true"
    />
  </v-app>
</template>

<script>
import { SidebarMenu } from "vue-sidebar-menu";

import navigation from "@/resource/navigation.json";
import "../assets/custom.css";

import { isAuthorized, getActorData } from "@/util/user";

export default {
  components: {
    SidebarMenu,
  },
  data() {
    return {
      collapsed: true,
      sidebarMenu: false,
      themes: [
        {
          name: "Default theme",
          input: "",
        },
        {
          name: "White theme",
          input: "white-theme",
        },
      ],
      selectedTheme: "white-theme",
      isOnMobile: false,
    };
  },

  computed: {
    menu() {
      let menu = JSON.parse(JSON.stringify(navigation.menu));
      this.filterNav(menu, this.allowedUseCaseIds);
      return menu;
    },
    allowedUseCaseIds() {
      let actor = getActorData();
      if (actor) {
        return actor.AllowedUseCaseIds;
      } else {
        return [];
      }
    },
    isAuthorized() {
      return isAuthorized();
    },
  },
  mounted() {
    // this.onResize();
    window.addEventListener("resize", this.onResize);
  },

  methods: {
    filterNav(menu, allowedUseCaseIds) {
      let i = menu.length;
      let useCase;
      let children;

      while (i--) {
        useCase = this.getNested(menu[i], "href", "params", "useCase");

        if (useCase && !allowedUseCaseIds.includes(useCase)) {
          menu.splice(i, 1);
        }

        children = this.getNested(menu[i], "child");

        if (children && children.length) {
          this.filterNav(menu[i].child, allowedUseCaseIds);

          if (menu[i].child.length == 0) {
            menu.splice(i, 1);
          }
        }
      }
    },
    logout() {
      let refreshToken = JSON.parse(localStorage.getItem("tokens")).refreshToken; 
      this.$http
        .post("account/logout", {refreshToken: refreshToken} )
        .then(res => console.log(res))
        .catch((err) => console.error(err));
      localStorage.removeItem("tokens");
      this.$router.go(0);
    },
    getNested(obj, ...args) {
      return args.reduce((obj, level) => obj && obj[level], obj);
    },
    onToggleCollapse(collapsed) {
      console.log(collapsed);
      this.collapsed = collapsed;
    },
    onItemClick(event, item, node) {
      console.log("onItemClick");
    },
    onResize() {
      if (this.sidebarMenu) {
        if (window.innerWidth <= 767) {
          this.isOnMobile = true;
          this.collapsed = true;
        } else {
          this.isOnMobile = false;
          this.collapsed = false;
        }
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "./../../node_modules/vue-sidebar-menu/dist/vue-sidebar-menu.css";

.v-sidebar-menu {
  top: 64px;
}

@media (max-width: 960px) {
  .v-sidebar-menu {
    top: 56px;
  }
}

.padd0 {
  padding-left: 20px;
}

.padd1 {
  padding-left: 70px;
}

.padd2 {
  padding-left: 250px;
}

.sidebar-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 900;
}
</style> 