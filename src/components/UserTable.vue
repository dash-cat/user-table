<template>
  <div>
    <input
      type="text"
      v-model="searchQueryLocal"
      @input="onSearch"
      placeholder="Поиск по имени или электронной почте"
    />
    <table>
      <thead>
        <tr>
          <th @click="sort('picture.medium')">Аватар</th>
          <th @click="sort('name.first')">ФИО</th>
          <th @click="sort('gender')">Пол</th>
          <th @click="sort('location.country')">Страна</th>
          <th @click="sort('dob.date')">Дата рождения</th>
          <th @click="sort('email')">Адрес электронной почты</th>
          <th @click="sort('phone')">Телефон</th>
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
      <button @click="prevPage" :disabled="currentPage === 1">Пред.</button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">След.</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'UserTable',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const searchQueryLocal = ref<string>(route.query.search as string || '');
    const sortKeyLocal = ref<string>(route.query.sortKey as string || '');
    const sortOrderLocal = ref<string>(route.query.sortOrder as string || 'asc');

    const searchQuery = computed(() => store.state.searchQuery);
    const currentPage = computed(() => store.state.currentPage);
    const sortKey = computed(() => store.state.sortKey);
    const sortOrder = computed(() => store.state.sortOrder);
    const users = computed(() => store.getters.paginatedUsers);
    const totalPages = computed(() => store.getters.totalPages);

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
input {
  width: 500px;
}

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
