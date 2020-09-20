<template>
  <Form
    v-if="updateObject.loadingFinished"
    type="update"
    method="PUT"
    :updateObject="updateObject"
    :formElements="formElements"
    :endpoint="updateEndpoint"
  />
</template>
<script>
import Form from './CrudForm.vue'
import axios from 'axios'
export default {
  components: {
    Form,
  },
  data() {
    return {
      updateObject: {},
    }
  },
  props: {
    formElements: {
      type: Array,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    identifier: {
      required: true,
    },
    apiDomain: {
      type: String,
      required: true,
    },
  },
  computed: {
    updateEndpoint: function() {
      return this.apiDomain + '/api/' + this.resource + '/' + this.identifier
    },
  },
  created() {
    axios
      .get(this.apiDomain + '/api/' + this.resource + '/' + this.identifier)
      .then((response) => {
        for (let prop in response.data) {
          this.$set(this.updateObject, prop, response.data[prop])
        }
        this.$set(this.updateObject, 'loadingFinished', true)
      })
  },
}
</script>
