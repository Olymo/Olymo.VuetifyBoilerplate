<template>
  <v-row class="container">
    <v-col cols="8">
      <v-data-table :items="data" :headers="headers">
        <template v-slot:item.image="{ item }">
          <div class="p-2">
            <v-img
              :src="item.image"
              :alt="item.name"
              height="100px"
              width="100px"
            ></v-img>
          </div>
        </template>
      </v-data-table>
    </v-col>
    <v-col>Filteri</v-col>
  </v-row>
</template>
<script>
import { mapState } from 'vuex'
import tableDefaults from './tableDefaults'
import config from './tableGlobalConfig.json'
import pixelWidth from 'string-pixel-width'
export default {
  props: tableDefaults.props,
  data: function() {
    return {
      config: config,
    }
  },
  computed: {
    ...mapState('table', ['data']),
    headers: function() {
      let headers = []

      if (this.tableHeaders) {
        headers = this.tableHeaders
      } else if (this.data.length) {
        headers = tableDefaults.makeHeadersFromFirstItem(
          this.data[0],
          this.excludedHeaders
        )
      }

      headers.forEach((x) => this.setHeaderWidth(x))

      return headers
    },
    excludedHeaders: function() {
      return this.config.headersToExclude.concat(this.headersToExclude)
    },
  },
  mounted: function() {
    this.$store.dispatch('table/setApiSettings', {
      endpoint: this.endpoint,
      method: this.method,
    })
    this.$store.dispatch('table/setSpecializedColumns', this.specializedColumns)
    this.$store.dispatch('table/getFromApi')
  },
  methods: {
    setHeaderWidth: function(header) {
      if (!isNaN(this.columnWidth)) {
        header.width = this.columnWidth
      }

      if (this.columnWidth == 'fit') {
        let firstDataItem = this.data[0]
        let columnWidths = {}
        for (let key of Object.keys(firstDataItem)) {
          columnWidths[key] = pixelWidth(firstDataItem[key], { size: 13 })
        }
        let headerTextWidth = pixelWidth(header.text, { size: 13 })
        header.width =
          columnWidths[header.value] > headerTextWidth
            ? columnWidths[header.value] + 50
            : headerTextWidth + 50
      } else {
        this.columnWidth = 'auto'
      }
    },
  },
}
</script>
