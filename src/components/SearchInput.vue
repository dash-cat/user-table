<template>
    <input
      type="text"
      v-model="localValue"
      @input="onInput"
      :placeholder="placeholder"
      class="search-input"
    />
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  
  export default defineComponent({
    name: 'SearchInput',
    props: {
      modelValue: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        default: 'Поиск',
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const localValue = ref(props.modelValue);
  
      watch(localValue, (newValue) => {
        emit('update:modelValue', newValue);
      });
  
      const onInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        localValue.value = target.value;
      };
  
      return {
        localValue,
        onInput,
      };
    },
  });
  </script>
  
  <style scoped>
  .search-input {
    padding: 12px;
    width: 100%;
    max-width: 500px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .search-input:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
    outline: none;
  }
  </style>
  