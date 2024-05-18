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
    setSearchQuery(state, query: string) {
      state.searchQuery = query;
    },
    setCurrentPage(state, page: number) {
      state.currentPage = page;
    },
    setSortKey(state, key: string) {
      state.sortKey = key;
    },
    setSortOrder(state, order: string) {
      state.sortOrder = order;
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
    setSearchQuery({ commit }, query: string) {
      commit('setSearchQuery', query);
    },
    setCurrentPage({ commit }, page: number) {
      commit('setCurrentPage', page);
    },
    setSortKey({ commit }, key: string) {
      commit('setSortKey', key);
    },
    setSortOrder({ commit }, order: string) {
      commit('setSortOrder', order);
    },
  },
  getters: {
    filteredUsers(state) {
      return state.users.filter(user =>
        user.name.first.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        user.name.last.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    paginatedUsers(state, getters) {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      const sortedUsers = [...getters.filteredUsers];
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
      return sortedUsers.slice(start, end);
    },
    totalPages(state, getters) {
      return Math.ceil(getters.filteredUsers.length / state.itemsPerPage);
    },
  },
});

function getValueByPath(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
