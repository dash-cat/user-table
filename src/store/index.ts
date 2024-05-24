import { createStore } from 'vuex';
import axios from 'axios';
import { User } from '@/types/User';
import { getValueByPath, includesIgnoringCase } from '@/utils';

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
  getters: {
    sortedUsers(state) {
      const sortedUsers = [...state.users];
      if (state.sortKey) {
        sortedUsers.sort((a, b) => {
          const aValue = getValueByPath(a, state.sortKey);
          const bValue = getValueByPath(b, state.sortKey);
          let result = 0;
          if (aValue < bValue) result = -1;
          if (aValue > bValue) result = 1;
          return state.sortOrder === 'asc' ? result : -result;
        });
      }
      return sortedUsers;
    },
    filteredUsers(state, getters) {
      const query = state.searchQuery.toLowerCase();
      return getters.sortedUsers.filter((user: User) =>
        includesIgnoringCase(user.name.first, query) ||
        includesIgnoringCase(user.name.last, query) ||
        includesIgnoringCase(user.email, query)
      );
    },
    paginatedUsers(state, getters) {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return getters.filteredUsers.slice(start, end);
    },
    totalPages(state, getters) {
      return Math.ceil(getters.filteredUsers.length / state.itemsPerPage);
    },
  },
});