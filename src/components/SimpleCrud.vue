<template>
    <Table endpoint="http://schematic-ipsum.herokuapp.com?n=50" :headersToExclude="toExclude" :specializedColumns="specialized" columnWidth="fit"/>
</template>
<script>
import Table from './crud/Table'
export default {
    components: {
        Table
    },
    data() {
        return {
            toExclude: ['userId'],
            specialized: [
                {
                    column: "avatar",
                    type: "image"
                }
            ]
        }
    }
}
</script>