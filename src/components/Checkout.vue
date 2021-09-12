<template>
    <v-container>
        <h1>Checkout</h1>
        <div class="row">
            <div class="col-md-6">
                <div v-show="orderState" class="text-h6 py-3">{{ orderMessage }}</div>
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
                        name="Phone number"
                        rules="required"
                        >
                          <v-text-field
                              v-model="phoneNumber"
                              :error-messages="errors"
                              label="Phone number"
                              required
                          ></v-text-field>
                        </validation-provider>
                        
                        <validation-provider
                            v-slot="{ errors }"
                            name="address"
                            rules="required|min:5"
                        >
                            <v-text-field
                            v-model="address"
                            :error-messages="errors"
                            label="Address"
                            required
                            ></v-text-field>
                        </validation-provider>
                        <v-btn
                          class="mr-4"
                          type="submit"
                          :disabled="invalid"
                          >
                          submit
                        </v-btn>

                    </form>
                </validation-observer>
            </div>
        </div>
    </v-container>
    
</template>

<script>
import { required, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import httpClient from '../util/httpClient'
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
    name: 'Checkout',
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data: () => ({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        orderMessage: translate("Success", "order"),
        orderState: false,
    }),
    methods: {
      submit() {
        this.$refs.observer.validate();
        
        httpClient.post('orders', {
          userFullName: this.name,
          userEmail: this.email,
          address: this.address,
          phoneNumber: this.phoneNumber
        })
        .then(response => {
            // alert("Uspesan order");
            this.orderState = true;
        })
        .catch(err => {
          this.orderState = true;
          this.orderMessage = translate("Failed", "order");
        });
      }
    },
    beforeCreate: function() {
      let userId = getActorData().UserId

      this.$http.get("users/" + userId)
        .then(response => {
          this.name = response.data.name,
          this.email = response.data.email
        })
        .catch(err => console.log(err))
    }
}
</script>