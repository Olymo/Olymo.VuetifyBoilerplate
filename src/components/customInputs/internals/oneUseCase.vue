<template>

          <div class="okvir" v-show="useCaseGroup.needToShow">

            <v-list-item :key="useCaseGroup.name" :value="useCaseGroup.name" @click="hanldeGroupItemClick">

                <v-list-item-content>
                  <v-list-item-title v-text="useCaseGroup.name" class="caption"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox dense v-model="useCaseGroup.groupChb" @change="hanldeGroupChbClick"></v-checkbox>
                </v-list-item-action>

            </v-list-item>

            <v-container v-show="expanded">
                    
                    <v-card>
                      <v-list>

                        <v-list-item-group multiple>

                          <template v-for="useCase in useCaseGroup.useCases">
                            <v-list-item v-show="useCase.needToShow" :key="`${useCase.name}`" @change="useCaseChbChange(useCase)" class="okvir lista">

                            <template v-slot:default="{ active }">
                                <v-list-item-content>
                                  <v-list-item-title v-text="`${useCase.name}`" class="caption"></v-list-item-title>
                                </v-list-item-content>

                                <v-list-item-action>
                                  <v-checkbox dense :input-value="active" v-model="useCase.selected" @change="useCaseChbChange(useCase)"></v-checkbox>
                                </v-list-item-action>
                            </template>

                            </v-list-item>
                          </template>

                        </v-list-item-group>

                      </v-list>
                    </v-card>

            </v-container>
              
          </div>
          
</template>

<script>
export default {
  data() {
    return {
      expanded: false
    }
  },
  props: {
    useCaseGroup: {
      type: Object,
      required: true
    }
  },
  created: function() {
    let selectedUseCases = this.useCaseGroup.useCases.filter(x => x.selected)
    if (selectedUseCases.length == this.useCaseGroup.useCases.length) {
      this.useCaseGroup.groupChb = true
    }
  },
  methods: {
    chechAllUseCases: function() {
      var that = this
      this.useCaseGroup.useCases.forEach(function(el) {
        el.selected = that.useCaseGroup.groupChb
      })
    },
    clickOnSearchUseCase: function(useCase) {
      if (this.useCaseGroup.useCases.length == 4) {
        if (useCase.selected) {
          this.useCaseGroup.useCases[1].selected = true
        }
        if (useCase.id == this.useCaseGroup.useCases[1].id) {
          if (!useCase.selected) {
            this.useCaseGroup.useCases.forEach(function(el) {
              el.selected = false
            })
            this.useCaseGroup.groupChb = false
          }
        }
      }
    },
    hanldeGroupItemClick: function() {
      this.expanded = !this.expanded
    },
    hanldeGroupChbClick: function() {
      this.expanded = false
      this.chechAllUseCases()
    },
    useCaseChbChange: function(useCase) {
      useCase.selected = !useCase.selected

      setTimeout(() => {
        let selectedUseCases = []

        this.useCaseGroup.useCases.forEach(oneUseCase => {
          if (oneUseCase.selected) {
            selectedUseCases.push(oneUseCase)
          }
        })

        if (selectedUseCases.length == this.useCaseGroup.useCases.length) {
          this.useCaseGroup.groupChb = true
        } else {
          this.useCaseGroup.groupChb = false
        }

        this.clickOnSearchUseCase(useCase)
      }, 1)
    }
  }
}
</script>

<style>
.okvir {
  border-bottom: 1px solid #ccc;
}
.lista {
  background-color: #e0f5ff;
}
</style>
