export const state = {
  primaryColor: "#0193CC",
  secondaryColor: "#607D8B",
  navigationGradientColor: "#02658e",
  navigationGradientSecondColor: "#01adee",
};

export const mutations = {
  SET_PRIMARY_COLOR(state, color) {
    state.primaryColor = color;
  },
  SET_SECONDARY_COLOR(state, color) {
    state.secondaryColor = color;
  },
  SET_NAVIGATION_GRADIENT_COLOR(state, color) {
    state.navigationGradientColor = color;
  },
  SET_NAVIGATION_GRADIENT_SECOND_COLOR(state, color) {
    state.navigationGradientSecondColor = color;
  },
};

export const actions = {
  setPrimaryColor({ commit }, color) {
    commit("SET_PRIMARY_COLOR", color);
  },
  setSecondaryColor({ commit }, color) {
    commit("SET_SECONDARY_COLOR", color);
  },
  setNavigationGradientColor({ commit }, color) {
    commit("SET_NAVIGATION_GRADIENT_COLOR", color);
  },
  setNavigationGradientSecondColor({ commit }, color) {
    commit("SET_NAVIGATION_GRADIENT_SECOND_COLOR", color);
  },
};
export const namespaced = true;
