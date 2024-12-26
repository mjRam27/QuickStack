import { createRouter, createWebHistory } from "vue-router";
import RegisterUser from "./pages/RegisterUser.vue";
import AdminRoot from "./pages/AdminRoot.vue";
import store from "./store";
import BookList from "./pages/BookList.vue";
import LoginUser from "./pages/LoginUser.vue";
import ViewUsers from "./pages/ViewUsers.vue";
import UpdateUser from "./pages/UpdateUser.vue";
import AdminBooks from "./pages/AdminBooks.vue";
import BooksHistory from "./pages/BooksHistory.vue";
import MyBooks from "./pages/MyBooks.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: BookList,
    },
    {
      path: "/search",
      name: "Search",
      component: BookList,
      props: (route) => ({ query: route.query.q || "" }), 
    },
    { path: "/register", component: RegisterUser, alias: "/" },
    { path: "/login", component: LoginUser, alias: "/" },
    { path: "/book", component: BookList },
    { path: "/my_book", component: MyBooks },
    // Protected Routes
    {
      path: "/admin",
      component: AdminRoot,
      meta: { requiresAuth: true },
    },
    {
      path: "/view-users",
      component: ViewUsers,
      meta: { requiresAuth: true },
    },
    {
      path: "/update-user/:id",
      component: UpdateUser,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/view-books",
      component: AdminBooks,
      meta: { requiresAuth: true },
    },
    {
      path: "/view-books-history",
      component: BooksHistory,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {

    const isAuthenticated = store.getters.isAuthenticated;
    if (isAuthenticated) {
      next();
    } else {
      next("/register"); 
    }
  } else {
    next(); 
  }
});

export default router;
