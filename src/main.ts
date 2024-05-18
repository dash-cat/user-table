import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';

const app = createApp(App);

app.use(store);
app.use(router);

router.isReady().then(() => {
  const route = router.currentRoute.value;
  const searchQuery = route.query.search || '';
  const page = parseInt(route.query.page as string, 10) || 1;
  const sortKey = route.query.sortKey || '';
  const sortOrder = route.query.sortOrder || 'asc';

  store.dispatch('setSearchQuery', searchQuery);
  store.dispatch('setCurrentPage', page);
  store.dispatch('setSortKey', sortKey);
  store.dispatch('setSortOrder', sortOrder);

  store.dispatch('fetchUsers').then(() => {
    app.mount('#app');
  });
});
