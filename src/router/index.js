import { createRouter, createWebHistory } from "vue-router";

import drawingBoard from "../pages/drawingBoard.vue";
import newBoard from "../pages/newBoard.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: drawingBoard,
  },
  {
    path: "/new",
    name: "New",
    component: newBoard,
  }
];


const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  //historyApiFallback: true,
  routes,
  linkActiveClass: "navActive",
  linkExactActiveClass: "navActive",

});

export default router;
