<template>
    <v-container fluid fill-height class="loginContainer"> <!-- class="loginOverlay" -->
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm4 elevation-6>
          <v-toolbar class="blue darken-4">
            <v-toolbar-title class="white--text"><h4>Welcome Back</h4></v-toolbar-title>
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
                        rules="required|min:3"
                        >
                          <!-- :counter="6" -->
                          <v-text-field
                              v-model="user.password"
                              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPassword ? 'text' : 'password'"
                              hint="At least 3 characters"
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
                          submit
                        </v-btn>

                        <v-btn @click="clear">
                          clear
                        </v-btn>

                        <a href="#" class="pl-5">Register here</a>
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
import { decodeJwtToken, isAuthorized } from '../util/user';

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
  }),

  methods: {
    submit () {
      this.$refs.observer.validate()

      this.$http.post("api/account/locallogin", this.user)
      .then(res => {
        console.log(res);

        localStorage.setItem("tokens", JSON.stringify(res.data));

        let actorData = decodeJwtToken();
        console.log(actorData);

        this.$http.get("api/carts")
        .then(res => {
          console.log("Ovo je odgovor od carts");
          console.log(res)
        })
        .catch(err => console.log(err));

      })
      .catch(err => console.error(err));

    },
    clear () {
      this.username = ''
      this.password = ''
      this.$refs.observer.reset()

      let result = isAuthorized();
      console.log(result);

      this.$http.get("api/account/checkAuthorization")
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
  },
  // created() {
  //   localStorage.clear();
  // }
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