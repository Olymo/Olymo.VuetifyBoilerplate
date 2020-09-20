<script>
import appConfig from '@src/app.config'
import Table from '@components/crud/Table.vue'
import Layout from '@layouts/main.vue'
import page from '@src/cruds/product.json'
export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.desription }],
  },
  components: { Layout, Table },
  data() {
    return {
      page: page,
    }
  },
}
</script>

<template>
  <Layout>
    <Table
      :apiSettings="page.apiSettings"
      :headersToExclude="page.toExclude"
      :specializedColumns="page.specialized"
      columnWidth="auto"
      :filters="page.filters"
    />
  </Layout>
</template>
