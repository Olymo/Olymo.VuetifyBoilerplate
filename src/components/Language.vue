<template>
  <div>
    <v-autocomplete
      :items="languages"
      v-model="selectedLanguage"
      v-on:change="changeLanguage"
      label="Select"
      item-text="title"
      item-value="code"
      :menu-props="{ botom: true, offsetY: true }"
      hide-details="auto"
      single-line
      dense
      flat
      :dark="theme"
      width="100px"
    >
      <template slot="selection" slot-scope="{ item }">
        <div class="font-weight-light text-caption">{{ item.title }}</div>
      </template>
      <template slot="item" slot-scope="{ item }">
        <v-list-item-content>
          <v-list-item-title v-text="item.title" class="font-weight-medium text-caption"></v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import { getSupportedLocales } from '../plugins/i18n/supportedLocales'

export default {
  props: ['theme'],
  data() {
    return {
      languages: getSupportedLocales(),
      selectedLanguage: '',
      translating: false,
      oldFlag: '',
      newFlag: ''
    }
  },
  mounted() {
    this.selectedLanguage = this.$i18n.locale
  },
  methods: {
    changeLanguage(language) {
      this.oldFlag = this.languages.find(x => x.code == this.$i18n.locale).flag
      this.newFlag = this.languages.find(x => x.code == language).flag

      this.showTranslatingOverlay().then(() => {
        window.localStorage.setItem('$VUE_VTS_PREFFERED_LANGUAGE', language)

        setTimeout(() => {
          this.$i18n.locale = language.code
          this.$router.go()
        }, 800)
      })
    },
    async showTranslatingOverlay() {
      this.translating = true
    }
  }
}
</script>

<style scoped>
.v-text-field {
  padding-top: 0px;
  margin-top: 0px;
}

.centered {
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}

.v-avatar img,
.v-avatar .v-icon,
.v-avatar .v-image,
.v-avatar .v-responsive__content {
  border-radius: 0px !important;
}

.animated {
  -webkit-transition-property: -webkit-transform;
  -webkit-transition-duration: 1s;
  -moz-transition-property: -moz-transform;
  -moz-transition-duration: 1s;
  -webkit-animation-name: pulse;
  -moz-animation-name: pulse;
  -webkit-animation-duration: 1.5s;
  -moz-animation-duration: 1.5s;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
  -moz-animation-timing-function: linear;
}

@-webkit-keyframes pulse {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  50% {
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@-moz-keyframes pulse {
  0% {
    -moz-transform: scale(1);
    transform: scale(1);
  }

  50% {
    -moz-transform: scale(1.2);
    transform: scale(1.2);
  }

  100% {
    -moz-transform: scale(1);
    transform: scale(1);
  }
}
</style>
