<script>
import appConfig from '@src/app.config'
import Table from '@components/crud/Table.vue'
import Layout from '@layouts/main.vue'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.desription }],
  },
  components: { Layout, Table },
  data() {
    return {
      toExclude: ['userId'],
      specialized: [
        {
          column: 'picture',
          type: 'image',
        },
      ],
      apiSettings: {
        endpoint: 'http://localhost:5000/api/products',
        method: 'GET',
        serverSidePaging: true,
      },
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
        },
        {
          component: 'v-select',
          key: 'category2',
          api: {
            endpoint: 'http://localhost:5000/api/products',
          },
        },
      ],
    }
  },
}
</script>

<template>
  <Layout>
    <Table
      :apiSettings="apiSettings"
      :headersToExclude="toExclude"
      :specializedColumns="specialized"
      columnWidth="auto"
      :formElements="formElements"
    />
  </Layout>
</template>
