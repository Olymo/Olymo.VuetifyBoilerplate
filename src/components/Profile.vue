<template>
    <div>
        <v-container>
            <div class="row">
                <div class="col-md-6 mx-auto">
                    <h1>{{ profileSettings }}</h1>
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
                            rules="min:5"
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
                            {{ updateText }}
                            </v-btn>

                        </form>
                    </validation-observer>
                </div>
            </div>
        </v-container>
    </div>

</template>

<script>
import { required, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import { getActorData } from '../util/user'
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
        name: '',
        email: '',
        username: '',
        password: '',
        showPassword: false,
        updateText: translate('Update', 'profile'),
        profileSettings: translate('Profile Settings', 'profile')
    }),
    methods: {
      submit() {
        this.$refs.observer.validate();
      }
    },
    beforeCreate: function() {
      let userId = getActorData().UserId

      this.$http.get("users/" + userId)
        .then(response => {
          this.name = response.data.name,
          this.email = response.data.email
          this.username = response.data.username
        })
        .catch(err => console.log(err))
    }
}
</script>