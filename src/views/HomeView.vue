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
      :rows="filteredUsers"
      :sortedColumnIndex="sortedColumnIndex"
      :sortOrder="sortOrder"
      :rowsInAPage="20"
      :page="currentPageLocal"
      @update:page="currentPageLocal = $event"
      @onClickColumnHeader="handleColumnHeaderClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import GenericTable from '../components/GenericTable.vue';
import SearchInput from '../components/SearchInput.vue';
import { User } from '@/types/User';
import { getValueByPath, includesIgnoringCase } from '@/utils';
import { ColumnModel } from '@/types/ColumnModel';
import { SortOrder } from '@/types/SortOrder';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'HomeView',
  components: {
    GenericTable,
    SearchInput,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const searchQueryLocal = ref<string>((route.query.search as string) || '');
    const currentPageLocal = ref<number>(parseInt(route.query.page as string, 10) || 1);

    const columns: ColumnModel[] = [
      { name: 'Аватар', isSortable: false, key: 'picture.medium', kind: 'image' },
      { name: 'ФИО', isSortable: true, key: 'name.first', kind: 'text' },
      { name: 'Пол', isSortable: true, key: 'gender', kind: 'text' },
      { name: 'Страна', isSortable: true, key: 'location.country', kind: 'text' },
      { name: 'Дата рождения', isSortable: true, key: 'dob.date', kind: 'date' },
      { name: 'Адрес электронной почты', isSortable: true, key: 'email', kind: 'email' },
      { name: 'Телефон', isSortable: true, key: 'phone', kind: 'text' },
    ];

    const sortOrder = computed(() => {
      return String(route.query.sortOrder) as SortOrder;
    });

    const sortedColumnIndex = computed(() => {
      return columns.findIndex(column => column.key === route.query.sortKey);
    });

    const sortedUsers = computed(() => {
      const sorted = [...store.state.users];
      if (route.query.sortKey) {
        sorted.sort((a, b) => {
          const aValue = getValueByPath(a, String(route.query.sortKey));
          const bValue = getValueByPath(b, String(route.query.sortKey));
          let result = 0;
          if (aValue < bValue) result = -1;
          if (aValue > bValue) result = 1;
          return route.query.sortOrder === 'asc' ? result : -result;
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

    watch(
      () => [searchQueryLocal.value, currentPageLocal.value],
      ([newSearchQuery, newPage]) => {
        // XXX: limit page's value
        router.replace({
          query: {
            search: newSearchQuery || undefined,
            page: newPage !== 1 ? (newPage || 1).toString() : undefined,
          },
        });
      }
    );

    const onSearch = (value: string) => {
      searchQueryLocal.value = value;
      currentPageLocal.value = 1;
    };

    const handleColumnHeaderClick = (index: number) => {
      let sortOrder: SortOrder;
      if (sortedColumnIndex.value === index) {
        sortOrder = route.query.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        sortOrder = 'asc';
      }

      router.replace({
        query: {
          ...router.currentRoute.value.query,
          sortKey: columns[index].key,
          sortOrder,
        },
      });
    };

    return {
      filteredUsers,
      searchQueryLocal,
      currentPageLocal,
      sortOrder,
      columns,
      sortedColumnIndex,
      onSearch,
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
