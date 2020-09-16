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
          column: 'avatar',
          type: 'image',
        },
      ],
    }
  },
}
</script>

<template>
  <Layout>
    <Table
      endpoint="http://schematic-ipsum.herokuapp.com?n=50"
      :headersToExclude="toExclude"
      :specializedColumns="specialized"
      columnWidth="fit"
    />
  </Layout>
</template>
