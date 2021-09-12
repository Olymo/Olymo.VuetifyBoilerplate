<template>
  <div>
    <v-container class="padding-bottom">

      <h1 class="text-center pa-4">Shopping cart</h1>
      <v-row v-if="this.cartItems.length > 0">
        <v-col :cols="12" md="9" sm="12" >
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-center">ITEM</th>
                <th class="text-center">PRICE</th>
                <th class="text-center">QUANTITY</th>
                <th class="text-center">TOTAL</th>
                <th class="text-center"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(cartItem, index) in cartItems" v-bind:key="cartItem.id">
                <td>
                  <v-list-item
                   :key="index"
                >
                  <v-list-item-avatar>
                    <v-img :src="require('../assets/img/shop/1.jpg')"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title >{{ cartItem.productName }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item></td>
                <td>${{ cartItem.price }}</td>
                <td>
                  <div small class="pt-3">Available: {{ cartItem.totalAvailable }}</div>
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
          <p class="headline">Order Summary</p>
          <p class="overline">Shipping and additional costs are calculated based on values you have entered.
          </p>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr>
                <td>Order Subtotal</td>
                <td class="text-right" style="width: 50px;">${{ orderSubTotal }}</td>
              </tr>
              <tr>
                <td>Shipping Charges</td>
                <td class="text-right" style="width: 50px;">$10.00</td>
              </tr>
              <tr>
                <td>Total</td>
                <td class="text-right" style="width: 50px;"><b>${{ orderSubTotal + 10}}</b></td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div class="text-center">
            <v-btn class="primary white--text mt-5" outlined @click="() => $router.push('checkout')">PROCEED TO PAY</v-btn>
          </div>
        </v-col>
      </v-row>

      <v-row v-else>
          <p class="display-1 font-weight-light	text-center pa-4">You cart is empty, go to products page.</p>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { required, regex } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

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
    orderSubTotal: 0,
  }),
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

