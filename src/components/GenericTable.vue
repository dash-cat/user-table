<template>
    <div>
      <table class="generic-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" @click="column.isSortable ? sort(column.key) : null">
              {{ column.name }}
              <span v-if="sortKey === column.key">
                {{ sortOrder === 'asc' ? '⬆️' : '⬇️' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in sortedRows" :key="row.id">
            <td v-for="column in columns" :key="column.key">
              <img v-if="column.isImage" :src="getValueByPath(row, column.key)" alt="image" />
              <span v-else>
                {{ getValueByPath(row, column.key) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, PropType } from 'vue';
  
  export default defineComponent({
    name: 'GenericTable',
    props: {
      columns: {
        type: Array as PropType<Array<{ name: string; isSortable: boolean; key: string; isImage?: boolean }>>,
        required: true,
      },
      rows: {
        type: Array as PropType<Array<Record<string, any>>>,
        required: true,
      },
    },
    setup(props) {
      const sortKey = ref<string>('');
      const sortOrder = ref<string>('asc');
  
      const sortedRows = computed(() => {
        if (!sortKey.value) return props.rows;
  
        return [...props.rows].sort((a, b) => {
          const aValue = getValueByPath(a, sortKey.value);
          const bValue = getValueByPath(b, sortKey.value);
  
          if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
          return 0;
        });
      });
  
      const sort = (key: string) => {
        if (sortKey.value === key) {
          sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
        } else {
          sortKey.value = key;
          sortOrder.value = 'asc';
        }
      };
  
      return {
        sortKey,
        sortOrder,
        sortedRows,
        sort,
        getValueByPath,
      };
    },
  });
  
  function getValueByPath(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
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
  </style>
  