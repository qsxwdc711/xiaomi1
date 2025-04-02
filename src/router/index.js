// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import MainPage from '../views/MainPage.vue';
import FavoritesPage from '../views/FavoritesPage.vue';
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/main',
    name: 'Main',
    component: MainPage
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesPage
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/login'
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});
export default router;