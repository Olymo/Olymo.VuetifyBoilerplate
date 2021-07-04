<template>
  <v-autocomplete
    :label="label"
    :color="color"
    :multiple="multiple"
    :outlined="outlined"
    dense
    hide-details="auto"
    v-model="selectedItems"
    :items="toDisplay"
    :bind="$props"
    :error-messages="errorMessages"
  >
    <template v-slot:prepend-item>
      <v-list-item ripple @click="toggleItems" :disabled="selectedItems.length == 0 && onlyDeselect">
        <v-list-item-action>
          <v-icon :color="selectedItems.length > 0 ? 'secondary' : ''">{{ itemIcon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ selectDeSelectAll }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-if="selectedItems.length > 5" v-slot:selection="{ item, index }">
        <v-chip v-if="index === 0">
          <span>{{ item.text }}</span>
        </v-chip>
        <span
          v-if="index === 1"
          class="grey--text caption"
        >
          (+{{ value.length - 1 }} others)
        </span>
      </template>
  </v-autocomplete>
</template>
<script>

// import translate from '@/utils/genTable/multilanguageHelper.js'

export default {
  data() {
    return {
      selectedItems: [],
      labels: {
        // selectAll: translate('Select All', 'fields'),
        // deSelectAll: translate('Deselect All', 'fields')
        selectAll: 'Select All',
        deSelectAll: 'Deselect All'
      }
    }
  },
  props: {
    items: Array,
    label: {
      type: String,
      // default: translate('Select item', 'fields')
      default: 'Select item'
    },
    color: {
      type: String,
      default: 'primary'
    },
    value: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: true
    },
    clearData: {
      type: Number,
      default: 0
    },
    outlined: {
      type: Boolean,
      default: true
    },
    errorMessages: {
      type: Array,
      required: false
    },
    onlyDeselect: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    itemsSelectedAll() {
      return this.selectedItems.length === this.toDisplay.length
    },
    someItemsSelected() {
      return this.selectedItems.length > 0 && !this.itemsSelectedAll
    },
    itemIcon() {
      if (this.someItemsSelected && this.onlyDeselect) return 'mdi-close-box'
      if (this.itemsSelectedAll) return 'mdi-close-box'
      if (this.someItemsSelected) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    toDisplay() {
      return this.items ? this.items : []
    },
    selectDeSelectAll() {
      return this.onlyDeselect ? this.labels.deSelectAll : this.labels.selectAll
    }
  },
  methods: {
    toggleItems() {
      this.$nextTick(() => {
        if (this.onlyDeselect) {
          this.selectedItems = []
        } else {
          if (this.itemsSelectedAll) {
            this.selectedItems = []
          } else {
            this.selectedItems = this.toDisplay.map(x => x.value)
          }
        }
      })
    }
  },
  watch: {
    selectedItems: {
      handler() {
        this.$emit('input', this.selectedItems)
      }
    },
    value: {
      handler() {
        this.selectedItems = this.value
      }
    },
    clearData: {
      handler() {
        if (this.clearData) {
          this.selectedItems = []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-chip.v-size--default {
  height: auto !important;
  font-size: 12px;
}
</style>
