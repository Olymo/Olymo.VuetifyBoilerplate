<template>
  <div>
    <FormBuilder
      :formElements="formElements"
      :handleSubmit="handleInsert"
      :errors="validationErrors"
    />
    <v-snackbar v-model="snackbar" right :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import FormBuilder from './FormBuilder.vue'
import axios from 'axios'
export default {
  components: {
    FormBuilder,
  },
  data: function() {
    return {
      snackbar: false,
      snackbarColor: 'success',
      snackbarText: 'Successfull insert.',
      validationErrors: {},
    }
  },
  props: {
    formElements: {
      type: Array,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: 'POST',
    },
    clientErrorResponseCode: {
      type: Number,
      default: 422,
    },
  },
  methods: {
    handleInsert(objectToInsert) {
      axios
        .post(this.endpoint, objectToInsert)
        .then(() => {
          this.snackbarColor = 'success'
          this.snackbar = true
          this.snackbarText = 'Successfull insert.'
        })
        .catch((error) => {
          this.snackbar = true
          if (error.response.status == this.clientErrorResponseCode) {
            this.snackbarColor = 'warning'
            this.snackbarText = 'There are some validation errors.'
            this.getErrorsFromResponse(error.response)
          } else {
            this.snackbarColor = 'red'
            this.snackbarText =
              'An error has occured. Please contact administrator.'
          }
        })
    },
    getErrorsFromResponse(response) {
      this.validationErrors = {}
      for (let error of response.data) {
        this.$set(this.validationErrors, error.propertyName, [error.error])
      }
    },
  },
}
</script>
