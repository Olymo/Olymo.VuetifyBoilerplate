<template>
  <v-row>
    <v-col cols="3" offset="4">
      <UpdateRestForm
        :formElements="formElements"
        resource="products"
        apiDomain="http://localhost:5000"
        identifier="18"
      />
    </v-col>
  </v-row>
</template>
<script>
import UpdateRestForm from '@src/components/crud/UpdateRestForm.vue'
import productForm from '@src/forms/apiProduct.json'
export default {
  components: {
    UpdateRestForm,
  },
  data() {
    return {
      formElements: productForm.formElements,
    }
  },
}
</script>
