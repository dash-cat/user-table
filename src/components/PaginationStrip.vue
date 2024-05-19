<template>
  <div class="pagination">
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PaginationStrip',
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ['prevPage', 'nextPage', 'goToPage'],
  setup(props, { emit }) {
    const prevPage = () => {
      emit('prevPage');
    };

    const nextPage = () => {
      emit('nextPage');
    };

    const goToPage = (page: number) => {
      emit('goToPage', page);
    };

    return {
      prevPage,
      nextPage,
      goToPage,
    };
  },
});
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.pagination button {
  margin: 0 4px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:hover {
  background-color: #f1f1f1;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination button.active {
  font-weight: bold;
  background-color: #007bff;
  color: white;
}
</style>
