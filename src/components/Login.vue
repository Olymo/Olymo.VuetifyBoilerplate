<template>
    <v-container fluid fill-height class="loginContainer padding-bottom"> <!-- class="loginOverlay" -->
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm4 elevation-6>
          <v-toolbar class="blue darken-4">
            <v-toolbar-title class="white--text"><h4>{{ welcomeBack}}</h4></v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text class="pt-4 pb-4">
              <div>
                <validation-observer
                ref="observer"
                v-slot="{ invalid }"
                >
                    <form @submit.prevent="submit">
                        <validation-provider
                        v-slot="{ errors }"
                        name="Username"
                        rules="required"
                        >
                          <v-text-field
                              v-model="user.username"
                              :error-messages="errors"
                              label="Username"
                              required
                          ></v-text-field>
                        </validation-provider>
                        
                        <validation-provider
                        v-slot="{ errors }"
                        name="Password"
                        rules="required|min:5"
                        >
                          <v-text-field
                              v-model="user.password"
                              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPassword ? 'text' : 'password'"
                              hint="At least 5 characters"
                              :error-messages="errors"
                              label="Password"
                              required
                              @click:append="showPassword = !showPassword"
                          ></v-text-field>
                        </validation-provider>

                        <div v-if="showWrongCredsError" class="red--text mb-6">{{ wrongCredsError }}</div>

                        <v-btn
                          class="mr-4"
                          type="submit"
                          :disabled="invalid"
                          >
                          {{ submitText }}
                        </v-btn>

                        <v-btn @click="clear" class="mr-4">
                          {{ clearText }}
                        </v-btn>
                        
                        <v-btn @click="() =>
                          $router.push({
                            name: 'register',
                          })">
                          {{ registerText }}
                        </v-btn>
                    </form>
                </validation-observer>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

</template>

<script>
import { required, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import httpClient from "../util/httpClient";
import translate from '../util/genTable/multilanguageHelper.js'
import EventBus from '../event-bus.js'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

extend('regex', {
  ...regex,
  message: '{_field_} {_value_} does not match {regex}',
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    httpClient,
  },
  data: () => ({
    user: {
      username: '',
      password: '',
    },
    showPassword: false,
    showWrongCredsError: false,
    wrongCredsError: translate('Wrong combination of username and password', 'login'),
    welcomeBack: translate('Welcome Back', 'welcome'),
    submitText: translate('Submit', 'forms'),
    clearText: translate('Clear', 'forms'),
    registerText: translate('Register', 'nav'),
  }),

  methods: {
    submit () {
      this.$refs.observer.validate()

      this.$http.post("account/locallogin", this.user)
      .then(res => {
        localStorage.setItem("tokens", JSON.stringify(res.data));
        
        EventBus.$emit('logged', 'User logged')
        this.$router.push('/products');
      })
      .catch(err => {
        this.showWrongCredsError = true;
      });

    },
    clear () {
      this.username = ''
      this.password = ''
      this.$refs.observer.reset()

    },
  },
}
</script>

<style scoped>
.loginOverlay {
  background:rgba(33,150,243,0.3);
}

.loginContainer {
  min-height: 55vh;
}

</style>