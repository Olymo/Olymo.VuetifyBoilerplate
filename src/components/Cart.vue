<template>
  <v-data-table
    :headers="headers"
    :items="products"
    class="elevation-1"
  >
    <template v-slot:item.image="{ item }">
        <div class="p-2">
            <v-img :src="item.image" :alt="item.name" height="100px"></v-img>
        </div>
    </template>

    <template v-slot:item.price="{ item }">
        <div class="p-2">${{ item.price }}</div>
    </template>

    <template v-slot:item.quantity="{ item }">
        <v-text-field
          v-model="item.quantity"
          name="quantity"
          @blur="updateQuantity($event.target.value, item.cartId)"
          type="number"
        ></v-text-field>

    </template>

    <template v-slot:item.action="{ item }">
        <div class="p-2">
            <v-btn color="error" @click="removeProductFromCart(item.cartId)">Delete</v-btn>
        </div>
    </template>

  </v-data-table>
</template>

<script>

  export default {
    name: "Cart",

    data: () => ({
      headers: [
        {
          text: 'No. #',
          align: 'start',
          value: 'no',
        },
        { text: 'Product name', value: 'pname' },
        { text: 'Image', value: 'image', sortable: false },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Action', value: 'action', sortable: false },
      ],
      // products: [
      //   {
      //     no: 1,
      //     pname: 'Frozen Yogurt',
      //     image: "https://via.placeholder.com/150",
      //     price: 10,
      //     quantity: 2,
      //     cartId: 1,
      //   },
      //   {
      //     no: 2,
      //     pname: 'Ice cream sandwich',
      //     image: "https://via.placeholder.com/150",
      //     price: 12,
      //     quantity: 1,
      //     cartId: 2,
      //   },
      //   {
      //     no: 3,
      //     pname: 'Eclair',
      //     image: "https://via.placeholder.com/150",
      //     price: 12,
      //     quantity: 1,
      //     cartId: 3,
      //   }
      // ],
      products: [],
    }),
    methods: {
        updateQuantity(quantity, cartId) {
            this.$http.put("api/carts", {
                quantity,
                cartId
            })
            .then(res => {
                console.log(res);
            })

            .catch(err => console.log(err));
            
        },
        removeProductFromCart(cartId) {
            console.log(cartId);
        }
    },
    beforeMount: function() {
      // this.$http.get("api/carts")
      //   .then(res => {
      //     console.log(res)
      //   })
      //   .catch(err => console.log(err));

    }
  }
</script>

<style>

.v-data-table-header span {
    color: #000 !important;
}

</style>