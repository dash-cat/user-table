import { createStore } from 'vuex';
import { User } from '@/types/User';
import axios from 'axios';

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
    setSearchQuery({ commit }, query) {
      commit('setFilters', { query });
    },
    setCurrentPage({ commit }, page) {
      commit('setFilters', { page });
    },
    setSortKey({ commit }, key) {
      commit('setFilters', { key });
    },
    setSortOrder({ commit }, order) {
      commit('setFilters', { order });
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
      return getters.sortedUsers.filter((user: User) =>
        user.name.first.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        user.name.last.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(state.searchQuery.toLowerCase())
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

function getValueByPath(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
