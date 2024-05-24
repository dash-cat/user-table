<template>
  <div class="user-table-container">
    <SearchInput
      v-model="searchQueryLocal"
      placeholder="Поиск по имени или электронной почте"
    />
    <div class="notification">
      Кликните на заголовок колонки для сортировки
    </div>
    <GenericTable
      :columns="columns"
      :rows="paginatedUsers"
      :sortedColumnIndex="sortedColumnIndex"
      :sortOrder="sortOrder"
      @onClickColumnHeader="handleColumnHeaderClick"
    />
    <div v-if="paginatedUsers.length === 0" class="no-results">
      Ничего не найдено
    </div>
    <PaginationStrip
      :currentPage="currentPageLocal"
      :totalPages="totalPages"
      @prevPage="prevPage"
      @nextPage="nextPage"
      @goToPage="goToPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import GenericTable from './GenericTable.vue';
import SearchInput from './SearchInput.vue';
import PaginationStrip from './PaginationStrip.vue';
import { User } from '@/types/User';
import { getValueByPath, includesIgnoringCase } from '@/utils';
import { ColumnModel } from '@/types/ColumnModel';

export default defineComponent({
  name: 'UserTable',
  components: {
    GenericTable,
    SearchInput,
    PaginationStrip,
  },
  setup() {
    const users = ref<User[]>([]);
    const searchQueryLocal = ref<string>('');
    const currentPageLocal = ref<number>(1);
    const itemsPerPage = ref<number>(20);
    const sortKey = ref<string>('');
    const sortOrder = ref<'asc' | 'desc'>('asc');
    const sortedColumnIndex = ref<number>(-1);

    const router = useRouter();

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api.json');
        users.value = response.data.results;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    onMounted(fetchUsers);

    const sortedUsers = computed(() => {
      const sorted = [...users.value];
      if (sortKey.value) {
        sorted.sort((a, b) => {
          const aValue = getValueByPath(a, sortKey.value);
          const bValue = getValueByPath(b, sortKey.value);
          let result = 0;
          if (aValue < bValue) result = -1;
          if (aValue > bValue) result = 1;
          return sortOrder.value === 'asc' ? result : -result;
        });
      }
      return sorted;
    });

    const filteredUsers = computed(() => {
      const query = searchQueryLocal.value.toLowerCase();
      return sortedUsers.value.filter((user: User) =>
        includesIgnoringCase(user.name.first, query) ||
        includesIgnoringCase(user.name.last, query) ||
        includesIgnoringCase(user.email, query)
      );
    });

    const paginatedUsers = computed(() => {
      const start = (currentPageLocal.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredUsers.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
    });

    watch(
      () => [searchQueryLocal.value, currentPageLocal.value, sortKey.value, sortOrder.value],
      ([newSearchQuery, newPage, newSortKey, newSortOrder]) => {
        if ((newPage as number) < 1) {
          newPage = 1;
        } else if ((newPage as number) > totalPages.value) {
          newPage = totalPages.value;
        }
        router.replace({
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
      currentPageLocal.value = 1;
    };

    const prevPage = () => {
      if (currentPageLocal.value > 1) {
        currentPageLocal.value -= 1;
      }
    };

    const nextPage = () => {
      if (currentPageLocal.value < totalPages.value) {
        currentPageLocal.value += 1;
      }
    };

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPageLocal.value = page;
      }
    };

    const handleColumnHeaderClick = (index: number) => {
      if (sortedColumnIndex.value === index) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortedColumnIndex.value = index;
        sortOrder.value = 'asc';
      }
      sortKey.value = columns[index].key;
    };

    const columns: ColumnModel[] = [
      { name: 'Аватар', isSortable: false, key: 'picture.medium', kind: 'image' },
      { name: 'ФИО', isSortable: true, key: 'name.first', kind: 'text' },
      { name: 'Пол', isSortable: true, key: 'gender', kind: 'text' },
      { name: 'Страна', isSortable: true, key: 'location.country', kind: 'text' },
      { name: 'Дата рождения', isSortable: true, key: 'dob.date', kind: 'date' },
      { name: 'Адрес электронной почты', isSortable: true, key: 'email', kind: 'email' },
      { name: 'Телефон', isSortable: true, key: 'phone', kind: 'text' },
    ];

    return {
      searchQueryLocal,
      currentPageLocal,
      columns,
      paginatedUsers,
      totalPages,
      sortedColumnIndex,
      sortOrder,
      onSearch,
      prevPage,
      nextPage,
      goToPage,
      handleColumnHeaderClick,
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
