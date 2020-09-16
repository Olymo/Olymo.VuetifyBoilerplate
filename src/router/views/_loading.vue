<script>
import Layout from '@layouts/main.vue'

export default {
  components: { Layout },
  page: {
    title: 'Loading page...',
    meta: [{ name: 'description', content: 'Loading page...' }],
  },
}
</script>

<template>
  <Layout>
    <Transition appear>
      <BaseIcon name="sync" spin />
    </Transition>
  </Layout>
</template>
