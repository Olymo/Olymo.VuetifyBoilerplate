<template>
    <v-container fluid fill-height class="padding-bottom">
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm4 elevation-6>
          <v-toolbar class="orange-bg blue darken-4">
            <v-toolbar-title class="white--text"><h4>{{ registerText }}</h4></v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text class="pt-4 pb-4">
              <div v-show="showRegister">
                <validation-observer
                ref="observer"
                v-slot="{ invalid }"
                >
                    <form @submit.prevent="submit">

                        <validation-provider
                        v-slot="{ errors }"
                        name="name"
                        rules="required|min:3|alpha_spaces"
                        >
                          <v-text-field
                              v-model="name"
                              :error-messages="errors"
                              label="Name"
                              required
                          ></v-text-field>
                        </validation-provider>
                        
                        <validation-provider
                            v-slot="{ errors }"
                            name="email"
                            rules="required|email"
                        >
                            <v-text-field
                            v-model="email"
                            :error-messages="errors"
                            label="E-mail"
                            required
                            ></v-text-field>
                        </validation-provider>

                        <validation-provider
                        v-slot="{ errors }"
                        name="username"
                        rules="required"
                        >
                          <v-text-field
                              v-model="username"
                              :error-messages="errors"
                              label="Username"
                              required
                          ></v-text-field>
                        </validation-provider>
                        
                        <validation-provider
                        v-slot="{ errors }"
                        name="password"
                        rules="required|min:5"
                        >
                          <!-- :counter="6" -->
                          <v-text-field
                              v-model="password"
                              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPassword ? 'text' : 'password'"
                              hint="At least 5 characters"
                              :error-messages="errors"
                              label="Password"
                              required
                              @click:append="showPassword = !showPassword"
                          ></v-text-field>
                        </validation-provider>

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

                        <!-- <router-link :to="{ name: 'login' }" class="pl-5" >Login</router-link> -->
                        <v-btn @click="() =>
                          $router.push({
                            name: 'login',
                          })">
                          {{ loginText }}
                        </v-btn>
                    </form>
                </validation-observer>
              </div>

              <div v-show="!showRegister">
                <h3>{{ responseMessage }}</h3>
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
import translate from '../util/genTable/multilanguageHelper.js'

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
  },
  data: () => ({
    username: '',
    password: '',
    showPassword: false,
    email: '',
    name: '',
    showRegister: true,
    responseMessage: '',
    submitText: translate('Submit', 'forms'),
    clearText: translate('Clear', 'forms'),
    registerText: translate('Register', 'nav'),
    loginText: translate('Login', 'nav'),
  }),

  methods: {
    submit () {
      this.$refs.observer.validate()

      this.$http.post("account/", {
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password
      })
        .then(res => {
            console.log(res);

            if(res.status == 201) {
              this.showRegister = false;

              this.responseMessage = res.data.message;
            }

      })
      .catch(err => {
        let errObj = {};
        for (const el of err.response.data.errors) {
          let key = el.PropertyName.toLowerCase();
          errObj[key] = el.Error
        }
        this.$refs.observer.setErrors(errObj);
      });

    },
    clear () {
      this.username = ''
      this.password = ''
      this.$refs.observer.reset()
    },
  },
  created() {
    localStorage.clear();
  }
}
</script>

<style>
.loginOverlay {
  background:rgba(33,150,243,0.3);
}

</style>