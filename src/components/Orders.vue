<template>
  <v-container>
    <div>

      <v-data-table
        :headers="headers"
        :items="orders"
        class="elevation-1"
      >
        <template v-slot:[`item.orderStatus`]="{ item }">
          <span class="mr-5">{{ orderStatusses[item.orderStatus] }}</span>
          <v-btn class="my-2" color="error" @click="cancelOrder(item.id)" :disabled="item.orderStatus != 0">Cancel</v-btn>
        </template>

      </v-data-table>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Orders",
  data() {
    return {
      orders: [],
      orderStatusses: ["Received", "Shipped", "Delivered", "Canceled"], 
      headers: [
        // { text: 'No. #', align: 'center', value: 'no' },
        { text: 'User name', value: 'userFullName' },
        { text: 'Address', value: 'address' },
        { text: 'Order date', value: 'orderDate' },
        { text: 'Order status', value: 'orderStatus', sortable: false },
      ],
    }
  },
  beforeCreate: function() {
    this.$http.get("orders")
      .then(response => {
        this.orders = response.data;
      })
      .catch(err => console.log(err));
  },
  methods: {
    cancelOrder(orderId) {
      this.$http.post("orders/cancel/" + orderId)
        .then(response => {
          console.log(response)
          this.orders.find(el => el.id == orderId).orderStatus = 4;
        })
        .catch(err => console.log(err));
    }
  }
}
</script>

<style>

.v-data-table-header span {
  color: #000 !important;
}

</style>