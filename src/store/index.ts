import { createStore } from 'vuex';
import axios from 'axios';
import { User } from '@/types/User';

export default createStore({
  state: {
    users: [] as User[],
  },
  mutations: {
    setUsers(state, users: User[]) {
      state.users = users;
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
  },
});
