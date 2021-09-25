<template>
    <v-container>
        <h1>Checkout</h1>
        <div class="row">
            <div class="col-md-6">
                <v-alert
                  v-if="showServerResponse"
                  dense
                  :type="responseType"
                  md="3"
                  >{{ serverResponse }}</v-alert
                >
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
        showServerResponse: false,
        responseType: "info",
        serverResponse: "",
    }),
    methods: {
      submit() {
        var self = this;
        this.$refs.observer.validate();
        
        httpClient.post('orders', {
          userFullName: this.name,
          userEmail: this.email,
          address: this.address,
          phoneNumber: this.phoneNumber
        })
        .then(response => {
          this.showServerResponse = true;
          this.serverResponse = translate("Your order has been successfully received", "order")
          this.responseType = "success";
            
        })
        .catch(err => {
          this.showServerResponse = true;
          this.serverResponse = translate("Server error, try again in a few moments", "order");
          this.responseType = "error"
        });

        setTimeout(function () {
          self.showServerResponse = false;
        }, 2000);
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