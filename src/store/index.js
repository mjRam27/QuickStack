import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  modules: {},
  state() {
    return {
      isLoggedIn: false,
      userInfo: {},
      searchQuery: "", // Added state to store the search query
    };
  },
  getters: {
    isAuthenticated(state) {
      return state.isLoggedIn;
    },
    userInfo(state) {
      return state.userInfo;
    },
    searchQuery(state) {
      return state.searchQuery; // Getter to access the search query
    },
  },
  mutations: {
    login(state, payload) {
      state.isLoggedIn = true;
      state.userInfo = payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userInfo = {};
    },
    setSearchQuery(state, query) {
      state.searchQuery = query; // Mutation to update the search query
    },
  },
  actions: {
    login({ commit }, payload) {
      console.log("payload", payload);
      commit("login", payload);
    },
    logout({ commit }) {
      commit("logout");
    },
    updateSearchQuery({ commit }, query) {
      commit("setSearchQuery", query); // Action to commit the search query mutation
    },
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});

export default store;
