export default {
  props: {
    apiSettings: {
      type: Object,
      required: true,
    },
    columnWidth: String | Number,
    tableHeaders: Array,
    headersToExclude: {
      type: Array,
      default: function() {
        return []
      },
    },
    specializedColumns: {
      type: Array,
      default: function() {
        return []
      },
    },
    filters: Array,
  },
  toSentenceCase(text) {
    var result = text.replace(/([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
  },
  makeHeadersFromFirstItem(item, headersToExclude) {
    return Object.keys(item)
      .filter((x) => !headersToExclude.includes(x))
      .map((key) => {
        return {
          text: this.toSentenceCase(key),
          value: key,
        }
      })
  },
}
