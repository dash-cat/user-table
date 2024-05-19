<template>
  <div>
    <input
      type="text"
      v-model="searchQueryLocal"
      @input="onSearch"
      placeholder="Поиск по имени или электронной почте"
    />
    <div class="notification">
      Кликните на заголовок колонки для сортировки
    </div>
    <GenericTable :columns="columns" :rows="filteredUsers" />
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
import GenericTable from './GenericTable.vue';
import { User } from '@/types/User';

export default defineComponent({
  name: 'UserTable',
  components: {
    GenericTable,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const searchQueryLocal = ref<string>(route.query.search as string || '');

    const searchQuery = computed(() => store.state.searchQuery);
    const currentPage = computed(() => store.state.currentPage);
    const sortKey = computed(() => store.state.sortKey);
    const sortOrder = computed(() => store.state.sortOrder);
    const users = computed(() => store.getters.paginatedUsers);
    const totalPages = computed(() => store.getters.totalPages);

    const columns = [
      { name: 'Аватар', isSortable: false, key: 'picture.medium', isImage: true },
      { name: 'ФИО', isSortable: true, key: 'name.first' },
      { name: 'Пол', isSortable: true, key: 'gender' },
      { name: 'Страна', isSortable: true, key: 'location.country' },
      { name: 'Дата рождения', isSortable: true, key: 'dob.date' },
      { name: 'Адрес электронной почты', isSortable: true, key: 'email' },
      { name: 'Телефон', isSortable: true, key: 'phone' },
    ];

    const filteredUsers = computed(() => {
      return users.value.filter((user: User) =>
        user.name.first.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.name.last.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
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
      columns,
      filteredUsers,
      currentPage,
      totalPages,
      onSearch,
      prevPage,
      nextPage,
      goToPage,
    };
  },
});
</script>

<style scoped>
.notification {
  margin: 16px 0px;
}
button.active {
  font-weight: bold;
}
</style>
