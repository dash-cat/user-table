<template>
    <div>
      <UserTable />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import UserTable from '../components/UserTable.vue';
  
  export default defineComponent({
    name: 'HomeView',
    components: {
      UserTable,
    },
  });
  </script>
  