import dataSourceBuilder from './internals/dataSourceBuilder'
export default {
  data() {
    return {
      changeFunctions: {
        dataSource: this.handleDataSourceChange,
        hide: this.handleHide,
      },
    }
  },
  methods: {
    toSentenceCase(text) {
      var result = text.replace(/([A-Z])/g, ' $1')
      return result.charAt(0).toUpperCase() + result.slice(1)
    },
    prepareFormObject() {
      for (let el of this.formElements) {
        this.formObject[el.key] = ''
        if (dataSourceBuilder.shouldContainDataSource(el)) {
          this.$set(this.dataSources, el.key, this.dataSource(el))
        }
      }
    },
    dataSource: function(formElement) {
      return dataSourceBuilder.buildDataSource(formElement)
    },
    handleChange(key, value) {
      let element = this.find(key)
      if (element && element.affects) {
        for (let toBeAffected of element.affects) {
          this.changeFunctions[toBeAffected.change.type](toBeAffected, value)
        }
      }
    },
    handleHide(toBeAffected, value) {
      this.$set(this.hidden, toBeAffected.key, value != '')
    },
    handleDataSourceChange: function(toBeAffected, value) {
      let isChangeSpecificToSelectedElement =
        toBeAffected.change.bindings && toBeAffected.change.bindings[value]
      if (isChangeSpecificToSelectedElement) {
        let binding = toBeAffected.change.bindings[value]
        if (Array.isArray(binding)) {
          this.$set(this.dataSources, toBeAffected.key, binding)
          return
        }
        if (binding.api) {
          this.$set(
            this.dataSources,
            toBeAffected.key,
            dataSourceBuilder.buildDataSource(binding)
          )
          return
        }

        throw new Error(
          'DataSource binding must contain either new DataSource or an api endpoint.'
        )
      }

      if (toBeAffected.change.api) {
        let dataSource = {
          api: {
            endpoint: toBeAffected.change.api.endpoint,
          },
        }
        if (toBeAffected.change.api.associateValue) {
          dataSource.api.endpoint += value
        }

        this.$set(
          this.dataSources,
          toBeAffected.key,
          dataSourceBuilder.buildDataSource(dataSource)
        )
      }
    },
  },
}
