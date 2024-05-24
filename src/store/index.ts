import { createStore } from 'vuex';
import axios from 'axios';
import { User } from '@/types/User';

export default createStore({
  state: {
    users: [] as User[],
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 20,
    sortKey: '',
    sortOrder: 'asc',
  },
  mutations: {
    setUsers(state, users: User[]) {
      state.users = users;
    },
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
    async fetchUsers({ commit }) {
      try {
        const response = await axios.get('/api.json');
        commit('setUsers', response.data.results);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    setFilters({ commit }, filters: {
      query: string, page: number, key: string, order: string
    }) {
      commit('setFilters', filters);
    },
  },
  getters: {},
});
