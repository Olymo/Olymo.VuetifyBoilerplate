<template>
  <v-row class="container">
    <v-col cols="10">
      <template>
        <v-row>
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn small dark v-bind="attrs" v-on="on">
                New Product
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">User Profile</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <CrudForm
                      :endpoint="apiSettings.endpoint"
                      :formElements="filters"
                      type="insert"
                    />
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
      <v-data-table
        :items="data"
        :headers="headers"
        :server-items-length="serverSidePaging.itemsLength"
        :options.sync="options"
        :multi-sort="true"
      >
        <template v-slot:item.image="{ item }">
          <div class="p-2">
            <v-img :src="item.image" :alt="item.name" width="100"></v-img>
          </div>
        </template>
      </v-data-table>
    </v-col>
    <v-col>
      <FormBuilder :formElements="filters" :handleSubmit="handleSearch" />
    </v-col>
  </v-row>
</template>
<script>
import { mapState } from 'vuex'
import tableDefaults from './tableDefaults'
import config from './tableGlobalConfig.json'
import pixelWidth from 'string-pixel-width'
import FormBuilder from './FormBuilder.vue'
import CrudForm from './CrudForm.vue'
import EventBus from '@utils/event-bus'
export default {
  components: { FormBuilder, CrudForm },
  props: tableDefaults.props,
  data: function() {
    return {
      config: config,
      options: {},
      dialog: false,
    }
  },
  computed: {
    ...mapState('table', ['data', 'serverSidePaging']),
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
    this.$store.dispatch('table/setApiSettings', this.apiSettings)
    this.$store.dispatch('table/setSpecializedColumns', this.specializedColumns)
    this.$store.dispatch('table/getFromApi')

    let that = this
    EventBus.$on('FORM_RESET', function() {
      that.dialog = false
    })
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
    handleSearch: function(formObject) {
      this.$store.dispatch('table/setQueryObject', formObject)
      this.$store.dispatch('table/getFromApi')
    },
  },
  watch: {
    options: {
      handler() {
        let sorts = []
        if (this.$store) {
          if (this.options.sortBy.length) {
            for (let i = 0; i < this.options.sortBy.length; i++) {
              sorts.push({
                sortBy: this.options.sortBy[i],
                direction: this.options.sortDesc[i] ? 'desc' : 'asc',
              })
            }
          }

          this.$store
            .dispatch('table/changePagingData', {
              perPage: this.options.itemsPerPage,
              currentPage: this.options.page,
              sorts: sorts,
            })
            .then(() => {
              this.$store.dispatch('table/getFromApi')
            })
        }
      },
    },
  },
}
</script>
