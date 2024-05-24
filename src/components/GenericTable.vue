<template>
  <div>
    <table class="generic-table">
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="column.key" @click="column.isSortable ? onClickColumnHeader(index) : null">
            {{ column.name }}
            <span v-if="sortedColumnIndex === index">
              {{ sortOrder === 'asc' ? '⬆️' : '⬇️' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedRows.length === 0">
          <td :colspan="columns.length" class="no-data">Ничего не найдено</td>
        </tr>
        <tr v-else v-for="row in paginatedRows" :key="row.id">
          <td v-for="column in columns" :key="column.key">
            <template v-if="column.kind === 'image'">
              <img :src="getValueByPath(row, column.key)" alt="image" />
            </template>
            <template v-else-if="column.kind === 'email'">
              <a :href="`mailto:${getValueByPath(row, column.key)}`">{{ getValueByPath(row, column.key) }}</a>
            </template>
            <template v-else-if="column.kind === 'date'">
              {{ new Date(getValueByPath(row, column.key)).toLocaleDateString('ru-RU') }}
            </template>
            <template v-else>
              {{ getValueByPath(row, column.key) }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <PaginationStrip
      :currentPage="page"
      :totalPages="totalPages"
      @prevPage="prevPage"
      @nextPage="nextPage"
      @goToPage="goToPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ColumnModel } from '@/types/ColumnModel';
import { SortOrder } from '@/types/SortOrder';
import { getValueByPath } from '@/utils';
import PaginationStrip from './PaginationStrip.vue';

export default defineComponent({
  name: 'GenericTable',
  components: {
    PaginationStrip,
  },
  props: {
    columns: {
      type: Array as PropType<ColumnModel[]>,
      required: true,
    },
    rows: {
      type: Array as PropType<Array<Record<string, any>>>,
      required: true,
    },
    sortedColumnIndex: {
      type: Number,
      required: true,
    },
    sortOrder: {
      type: String as PropType<SortOrder>,
      required: true,
    },
    rowsInAPage: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
  },
  emits: ['onClickColumnHeader', 'update:page'],
  setup(props, { emit }) {
    const onClickColumnHeader = (index: number) => {
      emit('onClickColumnHeader', index);
    };

    const prevPage = () => {
      if (props.page > 1) {
        emit('update:page', props.page - 1);
      }
    };

    const nextPage = () => {
      if (props.page < totalPages.value) {
        emit('update:page', props.page + 1);
      }
    };

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        emit('update:page', page);
      }
    };

    const paginatedRows = computed(() => {
      const start = (props.page - 1) * props.rowsInAPage;
      const end = start + props.rowsInAPage;
      return props.rows.slice(start, end);
    });

    const totalPages = computed(() => {
      console.log('totalPages',
       props.rows.length,
        props.rowsInAPage,
         props.rows.length / props.rowsInAPage,
         Math.ceil(props.rows.length / props.rowsInAPage)
          )
      return Math.ceil(props.rows.length / props.rowsInAPage);
    });

    return {
      paginatedRows,
      totalPages,
      onClickColumnHeader,
      prevPage,
      nextPage,
      goToPage,
      getValueByPath,
    };
  },
});
</script>

<style scoped>
.generic-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.generic-table th, .generic-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.generic-table th {
  cursor: pointer;
  background-color: #f9f9f9;
}

.generic-table th:hover {
  background-color: #f1f1f1;
}

.generic-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.generic-table tr:hover {
  background-color: #f1f1f1;
}

.generic-table img {
  max-width: 100px;
  height: auto;
}

.no-data {
  text-align: center;
  color: #999;
  font-style: italic;
}
</style>
