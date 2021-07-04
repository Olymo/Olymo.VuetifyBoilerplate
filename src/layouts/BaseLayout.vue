<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon
        @click.stop="(sidebarMenu = !sidebarMenu), (collapsed = true)"
      >
      </v-app-bar-nav-icon>
      <v-row></v-row>
      <v-spacer></v-spacer>
      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
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

<script>
import { SidebarMenu } from "vue-sidebar-menu";

import navigation from "@/resource/navigation.json";
import "../assets/custom.css";

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
      return navigation.menu;
    },
  },

  mounted() {
    // this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  methods: {
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
