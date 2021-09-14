<template>
        <v-text-field
            v-model="content"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            v-on:keyup.enter="keyupEnter"
            v-bind="$props"></v-text-field>
</template>

<script>
export default {
  props: {
    value: {
      type: Number | String,
      required: false
    },
    errorMessages: {
      type: Array,
      requred: false
    },
    label: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    solo: {
      type: Boolean,
      required: false
    },
    dense: {
      type: Boolean,
      required: false,
      default: true
    },
    outlined: {
      type: Boolean,
      required: false,
      default: true
    },
    'hide-details': {
      required: Boolean | String,
      default: 'auto'
    },
    keyupEnter: {
      type: Function,
      required: false
    },
    classs: {
      true: String,
      required: false
    },
    required: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      content: undefined,
      show: false
    }
  },
  mounted() {
    this.syncContentWithValue()
  },
  methods: {
    syncContentWithValue() {
      this.content = this.value
    }
  },
  watch: {
    value: {
      handler() {
        this.syncContentWithValue()
      }
    },
    content: {
      handler() {
        this.$emit('input', this.content)
      }
    }
  }
}
</script>

<style>
</style>
