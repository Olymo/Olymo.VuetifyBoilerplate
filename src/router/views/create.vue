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
          component: 'v-text-field',
          key: 'name',
          validation: 'required',
        },
        {
          component: 'v-text-field',
          key: 'price',
          type: 'number',
        },
        {
          component: 'v-autocomplete',
          key: 'category',
          dataSource: [
            { text: 'Category 1', value: 1 },
            { text: 'Category 2', value: 2 },
          ],
          behavior: {
            changesDataSource: [
              {
                changee: 'category2',
                bindings: {
                  '1': [
                    { text: 'A', value: 'A' },
                    { text: 'B', value: 'B' },
                  ],
                },
              },
            ],
          },
        },
        {
          component: 'v-select',
          key: 'category2',
          api: {
            endpoint: 'http://localhost:5000/api/products',
          },
        },
        {
          component: 'v-checkbox',
          key: 'testCheckbox',
          label: 'Primer Checkbox-a',
        },
      ],
    }
  },
}
</script>

<template>
  <Layout>
    <v-row>
      <v-col cols="6">
        <v-card class="pl-5 pr-5">
          <FormInsert
            :formElements="formElements"
            endpoint="http://localhost:5000/api/products"
          />
        </v-card>
      </v-col>
    </v-row>
  </Layout>
</template>
