<template>
  <div>
    <v-container class="padding-bottom">

      <h1 class="text-center pa-4">{{ text.shoppingCart }}</h1>
      <v-row v-if="this.cartItems.length > 0">
        <v-col :cols="12" md="9" sm="12" >
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th>ITEM</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>TOTAL</th>
                <th>ACTION</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(cartItem, index) in cartItems" v-bind:key="cartItem.id">
                <td>
                  <v-list-item
                   :key="index"
                >
                  <v-list-item-avatar>
                    <v-img :src="baseUrl + '/ProductImages/' + cartItem.image"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title >{{ cartItem.productName }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item></td>
                <td>${{ cartItem.price }}</td>
                <td>
                  <div small class="pt-3">{{ text.availableText}}: {{ cartItem.totalAvailable }}</div>
                  <v-text-field
                    class="pt-3"
                    label="Outlined"
                    style="width: 80px;"
                    single-line
                    outlined
                    v-model="cartItem.quantity"
                    @blur="updateQuantity($event.target.value, cartItem)"
                    type="number"
                    min="1"
                    :max="cartItem.totalAvailable"
                  ></v-text-field>
                </td>
                <td>${{ cartItem.price * cartItem.quantity }}</td>
                <td><v-btn color="error" @click="removeProductFromCart(cartItem.id)">Delete</v-btn></td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col :cols="12" md="3" sm="12" style="background-color: lightgray">
          <p class="headline">{{ text.summary }}</p>
          <p class="overline">{{ text.summaryText }}
          </p>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr>
                <td>{{ text.orderSubtotal }}</td>
                <td class="text-right" style="width: 50px;">${{ orderSubTotal }}</td>
              </tr>
              <tr>
                <td>{{ text.shipping }}</td>
                <td class="text-right" style="width: 50px;">$ {{ shippingValue }}</td>
              </tr>
              <tr>
                <td>{{ text.total }}</td>
                <td class="text-right" style="width: 50px;"><b>${{ orderSubTotal + shippingValue}}</b></td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div class="text-center">
            <v-btn class="primary white--text mt-5" outlined @click="() => $router.push('checkout')"> {{text.proceedToPay}} </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row v-else>
          <p class="display-1 font-weight-light	text-center pa-4"> {{ text.emptyCart }}</p>
      </v-row>
    </v-container>
  </div>
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
    cartItems: [],
    shippingValue: 20,
    orderSubTotal: 0,
    text: {
      shoppingCart: translate("Shopping cart", "cart"),
      emptyCart: translate("Your cart is empty", "cart"),
      availableText: translate("Available", "cart"),
      proceedToPay: translate("Proceed to pay", "cart"),
      shipping: translate("Shipping Charges", "cart"),
      orderSubtotal: translate("Order subtotal", "cart"),
      total: translate("Total", "cart"),
      summary: translate("Order Summary", "cart"),
      summaryText: translate("Shipping and additional costs are calculated based on values you have entered", "cart"),
    },
  }),
  computed: {
    baseUrl: function () {
      return process.env.VUE_APP_BACKEND_DOMAIN;
    },
  },
  methods: {
      updateQuantity(quantity, cartItem) {
        if(quantity > cartItem.totalAvailable) {
          cartItem.quantity = cartItem.totalAvailable;
          return
        }

        this.$http.put("cartItems", {
            quantity,
            cartItemId: cartItem.id,
            productId: cartItem.productId
        })
        .then(res => {
            console.log(res);
            this.calculateTotalPrice();
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
      removeProductFromCart(cartItemId) {
        this.$http.delete("cartItems/" + cartItemId)
        .then(res => {
          console.log(res);
          this.cartItems = this.cartItems.filter(cp => cp.id != cartItemId);

          this.calculateTotalPrice();
        })
        .catch(err => console.log(err));

      },
      calculateTotalPrice() {
        this.orderSubTotal = 0;
        this.cartItems.forEach(el => {
          this.orderSubTotal += el.quantity * el.price;
        });
        if(this.orderSubTotal < 300) {
          this.shippingValue = 20;
        } else {
          this.shippingValue = 0;
        }
      }
  },
  beforeCreate: function() {
    this.$http.get("cartItems")
      .then(response => {
        this.cartItems = response.data;

        this.calculateTotalPrice();
      })
      .catch(err => console.log(err));
  }
}
</script>

