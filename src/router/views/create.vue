<script>
import appConfig from '@src/app.config'
import Form from '@components/crud/CrudForm.vue'
import Layout from '@layouts/main.vue'
import productForm from '../../forms/productForm.json'
export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.desription }],
  },
  components: { Layout, Form },
  data() {
    return {
      formElements: productForm.formElements,
      updateObject: {
        email: 'luka.lukic@ict.edu.rs',
        name: 'Naziv',
        price: 222,
      },
    }
  },
}
</script>

<template>
  <Layout>
    <v-row>
      <v-col cols="3" offset="4">
        <v-card class="pl-5 pr-5 pt-5">
          <Form
            :formElements="formElements"
            :updateObject="updateObject"
            endpoint="http://localhost:5000/api/products"
            type="update"
          />
        </v-card>
      </v-col>
    </v-row>
  </Layout>
</template>
