<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

@Options({
  components: {},
})
export default class App extends Vue {
  mounted() {
    const store = useStore();
    const route = useRoute();

    const searchQuery = route.query.search || '';
    const page = parseInt(route.query.page as string, 10) || 1;
    const sortKey = route.query.sortKey || '';
    const sortOrder = route.query.sortOrder || 'asc';

    store.commit('setFilters', {
      query: searchQuery,
      page,
      key: sortKey,
      order: sortOrder
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
