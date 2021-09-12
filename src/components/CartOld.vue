<template>
  <v-container>

    <!-- <v-data-table
      :headers="headers"
      :items="products"
      class="elevation-1"
    >
      <template v-slot:item.image="{ item }">
        <v-img :src="item.image" :alt="item.name" height="100px"></v-img>
      </template>

      <template v-slot:item.price="{ item }">
          <div class="p-2">${{ item.price }}</div>
      </template>

      <template v-slot:item.quantity="{ item }">
          <v-text-field
            v-model="item.quantity"
            name="quantity"
            @blur="updateQuantity($event.target.value, item.id)"
            type="number"
          ></v-text-field>

      </template>

      <template v-slot:item.action="{ item }">
        <v-btn color="error" @click="removeProductFromCart($event.target.parentElement.parentElement.parentElement, item.id)">Delete</v-btn>
      </template>

    </v-data-table> -->

    <div v-if="this.cartItems.length > 0">

      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>No #</th>
              <th>Product Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Qauntity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cartProduct, index) in cartItems" v-bind:key="cartProduct.id">
              <td>{{ index + 1 }}</td>
              <td>{{ cartProduct.productName }}</td>
              <td><img src="https://via.placeholder.com/150" alt="cartProduct.productName" /></td>
              <td>${{ cartProduct.price }}</td>
              <td><v-text-field
                v-model="cartProduct.quantity"
                name="quantity"
                @blur="updateQuantity($event.target.value, cartProduct)"
                type="number"
              ></v-text-field></td>
              <td><v-btn color="error" @click="removeProductFromCart(cartProduct.id)">Delete</v-btn></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <div class="mt-10">
        <div class="row">
          <div class="offset-md-8 col-md-4 col-sm-12 grey lighten-4 black--text text-right">
            <div>Total price: ${{ totalPrice }}</div>
            <div>
              <router-link :to="{ name: 'checkout' }" class="pl-5" >Continue to checkout</router-link>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-else>
      <h1>You cart is empty, go to products page.</h1>
    </div>

    <!-- <v-alert
      color="grey lighten-4"
      class="mt-10 black--text text-right"
    >Total price: ${{ totalPrice }}</v-alert> -->

  </v-container>
</template>

<script>

export default {
  name: "Cart",

  data: () => ({
    headers: [
      {
        text: 'No. #',
        align: 'center',
        value: 'no',
      },
      { text: 'Product name', value: 'productName' },
      { text: 'Image', value: 'image', sortable: false },
      { text: 'Price', value: 'price' },
      { text: 'Quantity', value: 'quantity' },
      { text: 'Action', value: 'action', sortable: false },
    ],
    cartItems: [],
    totalPrice: 0,
  }),
  methods: {
      updateQuantity(quantity, cartItem) {
        this.$http.put("cartItems", {
            quantity,
            cartItemId: cartItem.id,
            productId: cartItem.productId
        })
        .then(res => {
            console.log(res);
            this.calculateTotalPrice();
        })
        .catch(err => console.log(err));
          
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
        this.totalPrice = 0;
        this.cartItems.forEach(el => {
          this.totalPrice += el.quantity * el.price;
        });
      }
  },
  beforeCreate: function() {
    this.$http.get("cartItems")
      .then(response => {
        console.log(response)
        this.cartItems = response.data;

        this.calculateTotalPrice();
      })
      .catch(err => console.log(err));
  }
}
</script>

<style>

.v-data-table-header span {
    color: #000 !important;
}

</style>