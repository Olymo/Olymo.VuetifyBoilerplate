<template>
  <ValidationObserver ref="observer">
    <v-row>
      <v-col
        v-for="formElement in formElements"
        :cols="cols(formElement)"
        :key="formElement.key"
      >
        <ValidationProvider
          :vid="formElement.key"
          v-slot="{ errors }"
          :name="formElement.key"
          :rules="rules(formElement)"
          :key="formElement.key"
        >
          <component
            @change="genericChange(formElement.key, $event)"
            :is="formElement.component"
            :ref="formElement.key"
            v-bind:key="formElement.key"
            :label="label(formElement)"
            :type="type(formElement)"
            :items="dataSources[formElement.key]"
            outlined
            :hide-detals="true"
            :error-messages="errors"
            v-model="formObject[formElement.key]"
            dense
          />
        </ValidationProvider>
      </v-col>
      <v-col cols="12">
        <v-btn small @click="submit" class="float-right mb-5">Submit</v-btn>
      </v-col>
    </v-row>
  </ValidationObserver>
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
    errors: {
      type: Object,
      required: false,
    },
  },
  data: function() {
    return {
      formObject: {},
      dataSources: {},
    }
  },
  mounted: function() {
    for (let el of this.formElements) {
      this.formObject[el.key] = ''
      if (this.shouldContainDataSource(el)) {
        this.$set(this.dataSources, el.key, this.dataSource(el))
      }
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
    cols: function(formElement) {
      return formElement.cols ? formElement.cols : 6
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
    find(key) {
      return this.formElements.filter((x) => x.key == key)[0]
    },
    genericChange(key, value) {
      let element = this.find(key)
      if (element && element.behavior) {
        let dsChanges = element.behavior.changesDataSource
        if (dsChanges) {
          for (let ds of dsChanges) {
            if (ds.bindings[value]) {
              this.$set(this.dataSources, ds.changee, ds.bindings[value])
            }
          }
        }
      }
    },
  },
  watch: {
    errors: {
      handler() {
        this.$refs.observer.setErrors(this.errors)
      },
    },
  },
}
</script>
<style lang="css" scoped>
.col,
.col-1,
.col-2,
.col-3,
.col-4,
.col-5,
.col-6,
.col-7,
.col-8,
.col-9,
.col-10,
.col-11,
.col-12,
.col-auto,
.col-lg,
.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-lg-auto,
.col-md,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-md-auto,
.col-sm,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-sm-auto,
.col-xl,
.col-xl-1,
.col-xl-2,
.col-xl-3,
.col-xl-4,
.col-xl-5,
.col-xl-6,
.col-xl-7,
.col-xl-8,
.col-xl-9,
.col-xl-10,
.col-xl-11,
.col-xl-12,
.col-xl-auto {
  padding: 0px 5px 0px 5px !important;
}
</style>
