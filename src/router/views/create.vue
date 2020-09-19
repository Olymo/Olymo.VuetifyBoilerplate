<script>
import appConfig from '@src/app.config'
import FormInsert from '@components/crud/FormInsert.vue'
import Layout from '@layouts/main.vue'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.desription }],
  },
  components: { Layout, FormInsert },
  data() {
    return {
      formElements: [
        {
          key: 'name',
          rules: 'required',
        },
        {
          key: 'price',
          type: 'number',
        },
        {
          key: 'email',
          rules: 'required|email',
        },
        {
          key: 'FirstName',
          rules: { regex: '^[A-Z][a-z]{2,12}$', required: true },
          hint: 'Primer: Petar (prvo slovo veliko)',
        },
        {
          component: 'v-autocomplete',
          key: 'category',
          dataSource: [
            { text: 'Category 1', value: 1 },
            { text: 'Category 2', value: 2 },
          ],
          affects: [
            {
              key: 'parentProductId',
              change: {
                type: 'dataSource',
                bindings: {
                  '1': [
                    { text: 'A', value: 'A' },
                    { text: 'B', value: 'B', selected: true },
                  ],
                  '2': {
                    api: {
                      endpoint: 'http://localhost:5000/api/products',
                    },
                  },
                },
              },
            },
          ],
        },
        {
          component: 'v-select',
          key: 'parentProductId',
          label: 'Parent Product',
          api: {
            endpoint: 'http://localhost:5000/api/products',
          },
          rules: 'required',
        },
        {
          component: 'v-checkbox',
          key: 'testCheckbox',
          label: 'Primer Checkbox-a',
          affects: [
            {
              key: 'category',
              change: {
                type: 'disable',
                when: true,
              },
            },
            {
              key: 'email',
              change: {
                type: 'clear',
              },
            },
          ],
        },
        {
          component: 'v-select',
          key: 'categoryId',
          label: 'Product Category',
          api: {
            endpoint: 'http://localhost:5000/api/categories',
          },
          affects: [
            {
              key: 'parentProductId',
              change: {
                type: 'dataSource',
                api: {
                  endpoint: 'http://localhost:5000/api/products?categoryId=',
                  associateValue: true,
                },
              },
            },
            {
              key: 'testCheckbox',
              change: {
                type: 'hide',
              },
            },
          ],
        },
      ],
    }
  },
}
</script>

<template>
  <Layout>
    <v-row>
      <v-col cols="3" offset="4">
        <v-card class="pl-5 pr-5 pt-5">
          <FormInsert
            :formElements="formElements"
            endpoint="http://localhost:5000/api/products"
          />
        </v-card>
      </v-col>
    </v-row>
  </Layout>
</template>
