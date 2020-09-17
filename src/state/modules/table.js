import axios from 'axios'
import settings from '../../app.config.json'

const state = () => ({
  data: [],
  apiSettings: settings.genericTableDefaults.apiSettings,
  specializedColumns: [],
  serverSidePaging: settings.genericTableDefaults.serverSidePaging,
})

function buildQueryString(state) {
  var qs = '?'
  if (state.serverSidePaging) {
    let paging = state.apiSettings.pagingOptions
    qs += paging.paginateQueryInstruction
    qs += '&' + paging.perPageProperty + '=' + state.serverSidePaging.perPage
    qs +=
      '&' +
      paging.currentPageProperty +
      '=' +
      state.serverSidePaging.currentPage

    if (state.serverSidePaging.sorts.length) {
      qs +=
        '&sortBy' +
        state.serverSidePaging.sorts[0].sortBy +
        '.' +
        state.sorts[0].direction
      for (let i = 1; i < state.serverSidePaging.sorts.length; i++) {
        qs +=
          ',' +
          state.serverSidePaging.sorts[i].sortBy +
          '.' +
          state.serverSidePaging.sorts[i].direction
      }
    }
  }
  return qs
}

const getters = {}

const actions = {
  getFromApi({ commit, state }) {
    if (state.apiSettings.method == 'GET') {
      axios
        .get(state.apiSettings.endpoint + buildQueryString(state))
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
  changePagingData({ commit }, pagingData) {
    commit('changePagingdata', pagingData)
  },
}

const mutations = {
  setData(state, response) {
    let dataItems = []
    if (state.apiSettings.serverSidePaging) {
      dataItems = response.data[state.apiSettings.pagingOptions.dataProperty]
      const paging = state.apiSettings.pagingOptions
      state.serverSidePaging.itemsLength =
        response.data[paging.serverSideItemsLength]
      state.currentPage = response.data[paging.currentPageProperty]
      state.perPage = response.data[paging.perPageProperty]
    } else {
      dataItems = response.data
    }
    if (state.specializedColumns.length) {
      dataItems.forEach((dataItem) => {
        for (let column of state.specializedColumns) {
          if (Object.keys(dataItem).includes(column.column)) {
            dataItem[column.type] = dataItem[column.column]
            delete dataItem[column.column]
          }
        }
      })
    }
    state.data = dataItems
  },
  setSettings(state, settings) {
    state.apiSettings = settings
    if (settings.serverSidePaging) {
      if (!settings.pagingOptions) {
        state.apiSettings.pagingOptions = {
          perPageProperty: 'perPage',
          currentPageProperty: 'page',
          dataProperty: 'items',
          paginateQueryInstruction: 'paginate=true',
          serverSideItemsLength: 'totalCount',
        }
      }
    }
  },
  setSpecializedColumns(state, specializedColumns) {
    state.specializedColumns = specializedColumns
  },
  changePagingdata(state, pagingData) {
    state.serverSidePaging.currentPage = pagingData.currentPage
    state.serverSidePaging.perPage = pagingData.perPage
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
