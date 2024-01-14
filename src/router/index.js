import { createRouter, createWebHistory } from "vue-router";

import drawingBoard from "../pages/drawingBoard.vue";


const routes = [
  {
    path: "/",
    name: "Home",
    component: drawingBoard,
  },
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
