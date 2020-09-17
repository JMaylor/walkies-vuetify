import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/profile/dogs",
    name: "Dogs",
    component: () => import("../views/Dogs.vue"),
  },
  {
    path: "/profile/events",
    name: "Events",
    component: () => import("../views/Events.vue"),
  },
  {
    path: "/search/map",
    name: "Map Search",
    component: () => import("../views/SearchMap.vue"),
  },
  {
    path: "/search/list",
    name: "List Search",
    component: () => import("../views/SearchList.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
