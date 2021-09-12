<template>
<div>
  <v-menu
    v-model="datePickerOpened"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        color="primary"
        prepend-inner-icon="event"
        v-model="content"
        :label="label"
        readonly
        outlined
        v-on="on"
        dense
        hide-details="auto"
        :disabled="disabled"
        :error-messages="errorMessages"
        clearable
      ></v-text-field>
    </template>
    <v-date-picker :disabled="disabled" no-title color="primary" v-model="content" @input="datePickerOpened = false" :max="maxValue" :min="minValue"></v-date-picker>
  </v-menu>
</div>
</template>

<script>
import translate from '@/util/genTable/multilanguageHelper.js'
export default {
  data: function() {
    return {
      content: null,
      datePickerOpened: null,
      label: translate('Date', 'fields.components.DateTextBox')
    }
  },
  created() {
    if (this.$attrs.label) {
      return (this.label = this.$attrs.label)
    }
    if (this.labelProp) {
      return (this.label = this.labelProp)
    }
  },
  props: {
    disabled: Boolean,
    value: String,
    labelProp: String,
    clearContent: {
      type: Number,
      default: 0
    },
    errorMessages: {
      type: Array,
      requred: false
    },
    minValue: String,
    maxValue: String
  },
  methods: {
    formatDate(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()
      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      return [year, month, day].join('-')
    }
  },
  mounted() {
    this.content = this.value
  },
  watch: {
    value: {
      handler() {
        if (this.value) {
          this.content = this.formatDate(this.value)
        } else {
          this.content = null
        }
      }
    },
    content: {
      handler() {
        this.$emit('input', this.content)
      }
    },
    clearContent: {
      handler() {
        if (this.clearContent) {
          this.content = null
        }
      }
    }
  }
}
</script>

<style>
</style>
