<template>
  <div>
    <ValidationObserver ref="observer">
      <template v-for="formElement in formElements">
        <ValidationProvider
          v-slot="{ errors }"
          :name="formElement.key"
          :rules="rules(formElement)"
          :key="formElement.key"
        >
          <component
            :is="formElement.component"
            v-bind:key="formElement.key"
            :label="label(formElement)"
            :type="type(formElement)"
            :items="dataSource(formElement)"
            outlined
            :error-messages="errors"
            v-model="formObject[formElement.key]"
            dense
          />
        </ValidationProvider>
      </template>
    </ValidationObserver>
    <v-btn small @click="submit">Submit</v-btn>
  </div>
</template>
<script>
import $ from 'jquery'
import {
  ValidationProvider,
  ValidationObserver,
} from 'vee-validate/dist/vee-validate.full'
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    formElements: {
      type: Array,
      required: true,
    },
    handleSubmit: {
      type: Function,
      required: true,
    },
  },
  data: function() {
    return {
      formObject: {},
    }
  },
  mounted: function() {
    for (let el of this.formElements) {
      this.formObject[el.key] = ''
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
    rules: function(formElement) {
      if (formElement.validation) {
        return formElement.validation
      }
      return ''
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
    submit() {
      this.$refs.observer.validate().then((valid) => {
        if (valid) {
          this.handleSubmit(this.formObject)
        }
      })
    },
  },
}
</script>
