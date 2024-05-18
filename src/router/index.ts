import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
    props: route => ({
      searchQuery: route.query.search || '',
      page: parseInt(route.query.page as string, 10) || 1,
      sortKey: route.query.sortKey || '',
      sortOrder: route.query.sortOrder || 'asc',
    }),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
