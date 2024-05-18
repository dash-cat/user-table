<template>
    <div>
      <input
        type="text"
        v-model="searchQuery"
        @input="onSearch"
        placeholder="Search by name or email"
      />
      <table>
        <thead>
          <tr>
            <th @click="sort('picture.medium')">Avatar</th>
            <th @click="sort('name.first')">Name</th>
            <th @click="sort('gender')">Gender</th>
            <th @click="sort('location.country')">Country</th>
            <th @click="sort('dob.date')">Date of Birth</th>
            <th @click="sort('email')">Email</th>
            <th @click="sort('phone')">Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.email">
            <td><img :src="user.picture.medium" alt="avatar" /></td>
            <td>{{ user.name.first }} {{ user.name.last }}</td>
            <td>{{ user.gender }}</td>
            <td>{{ user.location.country }}</td>
            <td>{{ new Date(user.dob.date).toLocaleDateString() }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default defineComponent({
    name: 'UserTable',
    setup() {
      const store = useStore();
      const searchQuery = computed(() => store.state.searchQuery);
      const currentPage = computed(() => store.state.currentPage);
      const users = computed(() => store.getters.paginatedUsers);
      const totalPages = computed(() => store.getters.totalPages);
  
      store.dispatch('fetchUsers');
  
      const onSearch = (event: Event) => {
        const target = event.target as HTMLInputElement;
        store.dispatch('setSearchQuery', target.value);
        store.dispatch('setCurrentPage', 1);
      };
  
      const sort = (key: string) => {
        if (store.state.sortKey === key) {
          const order = store.state.sortOrder === 'asc' ? 'desc' : 'asc';
          store.dispatch('setSortOrder', order);
        } else {
          store.dispatch('setSortKey', key);
          store.dispatch('setSortOrder', 'asc');
        }
      };
  
      const prevPage = () => {
        if (currentPage.value > 1) {
          store.dispatch('setCurrentPage', currentPage.value - 1);
        }
      };
  
      const nextPage = () => {
        if (currentPage.value < totalPages.value) {
          store.dispatch('setCurrentPage', currentPage.value + 1);
        }
      };
  
      const goToPage = (page: number) => {
        store.dispatch('setCurrentPage', page);
      };
  
      return {
        searchQuery,
        currentPage,
        users,
        totalPages,
        onSearch,
        sort,
        prevPage,
        nextPage,
        goToPage,
      };
    },
  });
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }
  th {
    cursor: pointer;
  }
  .active {
    font-weight: bold;
  }
  </style>
  