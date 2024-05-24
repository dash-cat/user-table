<template>
  <div>
    <UserTable 
      :search-query="searchQuery"
      :page="page"
      :sort-key="sortKey"
      :sort-order="sortOrder"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserTable from '../components/UserTable.vue';
import { useRoute } from 'vue-router';
import { SortOrder } from '@/types/SortOrder';

export default defineComponent({
  name: 'HomeView',
  components: {
    UserTable,
  },
  setup() {
    const route = useRoute();
    const searchQuery = (route.query.search as string) || '';
    const page = parseInt(route.query.page as string, 10) || 1;
    const sortKey = (route.query.sortKey as string) || '';
    const sortOrder = (route.query.sortOrder as SortOrder) || 'asc';

    return {
      searchQuery,
      page,
      sortKey,
      sortOrder,
    };
  },
});
</script>
