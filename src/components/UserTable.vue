<template>
  <div>
    <input
      type="text"
      v-model="searchQueryLocal"
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
import { defineComponent, computed, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'UserTable',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const searchQueryLocal = ref<string>('');
    const sortKeyLocal = ref<string>('');
    const sortOrderLocal = ref<string>('asc');

    const searchQuery = computed(() => store.state.searchQuery);
    const currentPage = computed(() => store.state.currentPage);
    const sortKey = computed(() => store.state.sortKey);
    const sortOrder = computed(() => store.state.sortOrder);
    const users = computed(() => store.getters.paginatedUsers);
    const totalPages = computed(() => store.getters.totalPages);

    onMounted(() => {
      const searchQuery = Array.isArray(route.query.search) ? route.query.search[0] : route.query.search || '';
      const page = parseInt(route.query.page as string, 10) || 1;
      const sortKey = Array.isArray(route.query.sortKey) ? route.query.sortKey[0] : route.query.sortKey || '';
      const sortOrder = Array.isArray(route.query.sortOrder) ? route.query.sortOrder[0] : route.query.sortOrder || 'asc';

      searchQueryLocal.value = String(searchQuery);
      sortKeyLocal.value = String(sortKey);
      sortOrderLocal.value = String(sortOrder);

      store.dispatch('setSearchQuery', searchQuery);
      store.dispatch('setCurrentPage', page);
      store.dispatch('setSortKey', sortKey);
      store.dispatch('setSortOrder', sortOrder);
      store.dispatch('fetchUsers');
    });

    watch(
      () => [searchQuery.value, currentPage.value, sortKey.value, sortOrder.value],
      ([newSearchQuery, newPage, newSortKey, newSortOrder]) => {
        router.push({
          query: {
            search: newSearchQuery || undefined,
            page: newPage !== 1 ? newPage.toString() : undefined,
            sortKey: newSortKey || undefined,
            sortOrder: newSortOrder !== 'asc' ? newSortOrder : undefined,
          },
        });
      }
    );

    const onSearch = (event: Event) => {
      const target = event.target as HTMLInputElement;
      searchQueryLocal.value = target.value;
      store.dispatch('setSearchQuery', target.value);
      store.dispatch('setCurrentPage', 1);
    };

    const sort = (key: string) => {
      if (sortKeyLocal.value === key) {
        const order = sortOrderLocal.value === 'asc' ? 'desc' : 'asc';
        sortOrderLocal.value = order;
        store.dispatch('setSortOrder', order);
      } else {
        sortKeyLocal.value = key;
        sortOrderLocal.value = 'asc';
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
      searchQueryLocal,
      sortKeyLocal,
      sortOrderLocal,
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
