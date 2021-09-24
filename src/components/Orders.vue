<template>
  <v-container>
    <div>

      <v-data-table
        :headers="headers"
        :items="orders"
        class="elevation-1 my-5"
      >
        <template v-if="canUpdateOrder" v-slot:[`item.orderStatus`]="{ item }">
          <v-row align="center" class="d-flex flex-row justify-between">
            <span class="mr-5" :id="'orderStatusText' + item.id">{{ orderStatusses[item.orderStatus].text }}</span>
            <v-col md="5">
              <v-select
                v-if="item.orderStatus < 2"
                :items="orderStatusses.filter(function(x) {
                  if(item.orderStatus != 0 && x.value == 3) {
                    return false;
                  }
                  return x.value > item.orderStatus;
                })"
                :label="text.changeOrderStatusText"
                :menu-props="{ bottom: true, offsetY: true }"
                :value="item.orderStatus"
                @input="(status) => updateOrderStatus(item, status)"
              >
              </v-select>
            </v-col>
            <div class="d-none red--text" :id="'orderStatusError' + item.id"></div>
          </v-row>
        </template>

        <template v-else v-slot:[`item.orderStatus`]="{ item }">
          <span class="mr-5">{{ orderStatusses[item.orderStatus].text }}</span>
          <v-btn class="my-2" color="error" @click="cancelOrder(item.id)" :disabled="item.orderStatus != 0">Cancel</v-btn>
        </template>

        <template v-slot:[`item.orderDate`]="{ item }">
          <span class="mr-5">{{ item.orderDate.replace("T", " ").split(".")[0] }}</span>
        </template>

      </v-data-table>
    </div>
  </v-container>
</template>

<script>
import { getActorData } from '../util/user'
import translate from '../util/genTable/multilanguageHelper.js'

export default {
  name: "Orders",
  data() {
    return {
      orders: [],
      orderStatusses: [
        {
            text: translate("Received", "order"),
            value: 0
        },
        {
            text: translate("Shipped", "order"),
            value: 1
        },
        {
            text: translate("Delivered", "order"),
            value: 2
        },
        {
            text: translate("Cancelled", "order"),
            value: 3
        }
      ],
      canUpdateOrder: getActorData().IsSuperAdmin || getActorData().AllowedUseCaseIds.includes("UpdateOrder"),
      headers: [
        { text: translate("User name", "order"), value: 'userFullName' },
        { text: translate("Address", "order"), value: 'address' },
        { text: translate("Order date", "order"), value: 'orderDate' },
        { text: translate("Order status", "order"), value: 'orderStatus', sortable: false },
      ],
      text: {
        changeOrderStatusText: translate("Change order status", "order"),
      }
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
      this.$http.put("orders/cancel/" + orderId)
        .then(response => {
          console.log(response);
          this.orders.find(el => el.id == orderId).orderStatus = 3;
        })
        .catch(err => console.log(err));
    },
    updateOrderStatus(item, status) {
      if(item.orderStatus > status || (status == 3 && item.orderStatus != 0)) {
        console.log("Ne moze sad cancel");
        return;
      }

      this.$http.put("orders/updateOrderStatus/" + item.id, { orderStatus: status })
        .then(response => {
          console.log(response)
          document.querySelector("#orderStatusText" + item.id).innerHTML = this.orderStatusses[status].text
        })
        .catch(err => {
          console.log(err);
          document.querySelector("#orderStatusError" + item.id).classList.remove('d-none');
          document.querySelector("#orderStatusError" + item.id).innerHTML = err.response.data.errors[0].Error;
        })

    }
  },
}
</script>

<style>

.v-data-table-header span {
  color: #000 !important;
}

.justify-between{
  justify-content: space-between;
}
</style>