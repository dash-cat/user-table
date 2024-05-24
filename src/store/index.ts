import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 20,
    sortKey: '',
    sortOrder: 'asc',
  },
  mutations: {
    setFilters(state, {
      query, page, key, order
    }: {
      query: string, page: number, key: string, order: string
    }) {
      if (query !== undefined) {
        state.searchQuery = query;
      }
      if (page !== undefined) {
        state.currentPage = page;
      }
      if (key !== undefined) {
        state.sortKey = key;
      }
      if (order !== undefined) {
        state.sortOrder = order;
      }
    },
  },
  actions: {
    setFilters({ commit }, filters: {
      query: string, page: number, key: string, order: string
    }) {
      commit('setFilters', filters);
    },
  },
  getters: {},
});
