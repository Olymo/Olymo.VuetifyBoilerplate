<template>
  <div>
    <h1>Filters:</h1>
    <template v-for="formElement in formElements">
      <component
        :is="formElement.component"
        v-bind:key="formElement.key"
        :label="label(formElement)"
        :type="type(formElement)"
        :items="dataSource(formElement)"
        outlined
        v-model="queryObject[formElement.key]"
        dense
      />
    </template>
    <v-btn small @click="handleSearch">Search</v-btn>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  props: {
    formElements: {
      type: Array,
      required: true,
    },
  },
  data: function() {
    return {
      queryObject: {},
    }
  },
  mounted: function() {
    for (let el of this.formElements) {
      this.queryObject[el.key] = ''
    }
  },
  methods: {
    label: function(formElement) {
      if (formElement.placeholder) {
        return formElement.placeholder
      }
      return this.toSentenceCase(formElement.key)
    },
    type: function(formElement) {
      return formElement.type ? formElement.type : ''
    },
    dataSource: function(formElement) {
      if (!this.shouldContainDataSource(formElement)) {
        return
      }
      if (formElement.dataSource) {
        return formElement.dataSource
      }
      if (!formElement.api) {
        throw new Error(
          formElement.component +
            ' must have defined dataSource property or appropriate api settings.'
        )
      }

      let items = this.loadDataSourceFromApi(formElement.api)

      return items
    },
    shouldContainDataSource(formElement) {
      let elementsWithDataSource = ['v-autocomplete', 'v-select']
      return elementsWithDataSource.includes(formElement.component)
    },
    loadDataSourceFromApi(api) {
      let items = []

      $.ajax({
        url: api.endpoint,
        async: false,
        success: function(data) {
          items = data
        },
      })

      if (!api.textProperty) {
        api.textProperty = 'name'
        api.valueProperty = 'id'
      }

      items.forEach((i) => {
        ;(i.text = i[api.textProperty]), (i.value = i[api.valueProperty])
      })

      return items
    },
    toSentenceCase(text) {
      var result = text.replace(/([A-Z])/g, ' $1')
      return result.charAt(0).toUpperCase() + result.slice(1)
    },
    handleSearch: function() {
      this.$store.dispatch('table/setQueryObject', this.queryObject)
      this.$store.dispatch('table/getFromApi')
    },
  },
}
</script>
