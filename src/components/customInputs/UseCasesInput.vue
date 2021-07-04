<template>
  
  <v-card elevation="3" id="block">

      <v-row>
          <v-col cols="6">
              <v-checkbox
                  v-model="selectAllChb"
                  :label="`${!selectAllChb ? 'Select all' : 'Deselect all'}`"
                  dense
                  @change="selectAllChbClick"
                ></v-checkbox>
          </v-col>

          <v-col cols="6">
              <v-text-field
                v-model="search"
                label="Search"
                outlined
                dense
              ></v-text-field>
          </v-col>
      </v-row>

      <v-card id="listBlock">
        <v-list>
            <v-list-item-group multiple>
                <oneUseCase v-for="item in items" :useCaseGroup="item" :key="item.name"></oneUseCase>
            </v-list-item-group>
        </v-list>
      </v-card>

  </v-card>

</template>

<script>
import oneUseCase from '@/components/customInputs/internals/oneUseCase'
import httpClient from '@/util/httpClient'
export default {
  components: {
    oneUseCase
  },
  methods: {
    selectAllChbClick() {
      var that = this

      this.items.forEach(group => {
        group.groupChb = that.selectAllChb
        group.needToShow = true
        group.useCases.forEach(el => {
          el.selected = that.selectAllChb
        })
      })

      this.manualClearSearchField = true
      this.search = ''
    }
  },
  data() {
    return {
      items: [],
      selectAllChb: false,
      search: '',
      cacheItems: [],
      manualClearSearchField: false
    }
  },
  props: {
    value: Array,
    default: function() {
      return []
    }
  },
  async mounted() {
    var interval = setInterval(() => {
      if (this.value) {
        clearInterval(interval)
      }

      var that = this
      let totalUseCases = []
      let selectedUseCases = []

      httpClient.get('usecasedocs/getusecaseactornames').then(response => {
        response.data.forEach(function(group) {
          group.groupChb = false
          group.needToShow = true
          group.useCases.forEach(function(useCase) {
            useCase.needToShow = true
            totalUseCases.push(useCase)
            let check = that.value ? that.value.includes(useCase.id) : false
            if (check) {
              useCase.selected = true
              selectedUseCases.push(useCase)
            } else {
              useCase.selected = false
            }
          })
        })

        if (totalUseCases.length) {
          that.selectAllChb = totalUseCases.length == selectedUseCases.length
        } else {
          that.selectAllChb = false
        }

        that.cacheItems = response.data
        that.items = response.data
      })
    }, 2000)
  },
  watch: {
    search: {
      handler() {
        if (this.search == '' && this.manualClearSearchField) {
          return
        }
        var that = this
        var keyWordsForCRUD = ['add', 'search', 'update', 'remove']
        this.manualClearSearchField = false

        this.items.forEach(group => {
          group.useCases.forEach(useCase => {
            let name = useCase.name
            let firstWord = name.split(' ')[0]
            if (keyWordsForCRUD.includes(firstWord.toLocaleLowerCase())) {
              name = name.slice(name.indexOf(' ') + 1)
            }
            if (
              name.toLocaleLowerCase().includes(that.search.toLocaleLowerCase())
            ) {
              useCase.needToShow = true
            } else {
              useCase.needToShow = false
            }
          })

          let useCasesToShow = group.useCases.filter(x => x.needToShow)
          if (useCasesToShow.length > 0) {
            group.needToShow = true
          } else {
            group.needToShow = false
          }
        })
      }
    },
    items: {
      handler() {
        let selectedElements = []
        let totalElements = []
        this.items.forEach(group => {
          group.useCases.forEach(useCase => {
            totalElements.push(useCase)
            if (useCase.selected) {
              selectedElements.push(useCase.id)
            }
          })
        })
        if (selectedElements.length == totalElements.length) {
          this.selectAllChb = true
        } else {
          this.selectAllChb = false
        }
        this.$emit('input', selectedElements)
      },
      deep: true
    }
  }
}
</script>
<style>
#block {
  margin-top: 10px;
  padding: 20px;
  padding-top: 0px;
}
#listBlock {
  margin-top: -10px;
}
</style>
