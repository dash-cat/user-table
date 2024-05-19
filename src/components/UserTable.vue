<template>
  <div class="user-table-container">
    <SearchInput
      v-model="searchQueryLocal"
      placeholder="Поиск по имени или электронной почте"
    />
    <div class="notification">
      Кликните на заголовок колонки для сортировки
    </div>
    <GenericTable :columns="columns" :rows="filteredUsers" />
    <div v-if="filteredUsers.length === 0" class="no-results">
      Ничего не найдено
    </div>
    <PaginationStrip
      :currentPage="currentPage"
      :totalPages="totalPages"
      @prevPage="prevPage"
      @nextPage="nextPage"
      @goToPage="goToPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import GenericTable from './GenericTable.vue';
import { User } from '@/types/User';
import { ColumnModel } from '@/types/ColumnModel';
import SearchInput from './SearchInput.vue';
import PaginationStrip from './PaginationStrip.vue';

export default defineComponent({
  name: 'UserTable',
  components: {
    GenericTable,
    SearchInput,
    PaginationStrip,
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

    const columns: ColumnModel[] = [
      { name: 'Аватар', isSortable: false, key: 'picture.medium', kind: 'image' },
      { name: 'ФИО', isSortable: true, key: 'name.first', kind: 'text' },
      { name: 'Пол', isSortable: true, key: 'gender', kind: 'text' },
      { name: 'Страна', isSortable: true, key: 'location.country', kind: 'text' },
      { name: 'Дата рождения', isSortable: true, key: 'dob.date', kind: 'date' },
      { name: 'Адрес электронной почты', isSortable: true, key: 'email', kind: 'email' },
      { name: 'Телефон', isSortable: true, key: 'phone', kind: 'text' },
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

    const onSearch = (value: string) => {
      searchQueryLocal.value = value;
      store.dispatch('setSearchQuery', value);
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
.user-table-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.notification {
  margin: 16px 0px;
  font-size: 14px;
  color: #555;
}

.no-results {
  text-align: center;
  margin: 16px 0;
  font-size: 16px;
  color: #999;
}
</style>
