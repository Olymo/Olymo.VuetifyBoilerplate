<template>
    <v-container fluid fill-height class="loginOverlay">
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm4 elevation-6>
          <v-toolbar class="orange-bg blue darken-4">
            <v-toolbar-title class="white--text"><h4>Register</h4></v-toolbar-title>
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
                        name="Name"
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
                        name="Username"
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
                        name="Password"
                        rules="required|min:3"
                        >
                          <!-- :counter="6" -->
                          <v-text-field
                              v-model="password"
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

                        <a href="#" class="pl-5">Login</a>
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
import httpClient from "../util/httpClient";

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
    username: '',
    password: '',
    showPassword: false,
    email: '',
    name: '',
    showRegister: true,
    responseMessage: ''
  }),

  methods: {
    submit () {
      this.$refs.observer.validate()

      this.$http.post("api/account/", {
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
      .catch(err => console.error(err));

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

<style scoped>
.loginOverlay {
  background:rgba(33,150,243,0.3);
}

</style>