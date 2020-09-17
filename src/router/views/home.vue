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
    />
  </Layout>
</template>
