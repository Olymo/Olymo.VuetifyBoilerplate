import axios from 'axios'

const state = () => ({
  data: [],
  apiSettings: {
    endpoint: null,
    method: 'GET',
  },
  specializedColumns: [],
})

const getters = {}

const actions = {
  getFromApi({ commit, state }) {
    if (state.apiSettings.method == 'GET') {
      axios
        .post(state.apiSettings.endpoint, {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              ipsum: 'id',
            },
            name: {
              type: 'string',
              ipsum: 'name',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            bio: {
              type: 'string',
              ipsum: 'sentence',
            },
            age: {
              type: 'integer',
            },
            avatar: {
              type: 'string',
              ipsum: 'small image',
            },
          },
        })
        .then((response) => {
          commit('setData', response)
        })
    }
  },
  setApiSettings({ commit }, apiSettings) {
    commit('setSettings', apiSettings)
  },
  setSpecializedColumns({ commit }, specializedColumns) {
    commit('setSpecializedColumns', specializedColumns)
  },
}

const mutations = {
  setData(state, data) {
    if (state.specializedColumns.length) {
      data.data.forEach((dataItem) => {
        for (let column of state.specializedColumns) {
          if (Object.keys(dataItem).includes(column.column)) {
            dataItem[column.type] = dataItem[column.column]
            delete dataItem[column.column]
          }
        }
      })
    }
    state.data = data.data
  },
  setSettings(state, settings) {
    state.apiSettings = settings
  },
  setSpecializedColumns(state, specializedColumns) {
    state.specializedColumns = specializedColumns
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
