import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '../views/Home.vue';
import CalculateTabs from '../views/CalculateTabs.vue';
import CalculateTabsBri from '../views/CalculateTabsBri.vue';
import PhotoBooth from "@/views/PhotoBooth.vue";

import CalculatePopup from '../views/CalculatePopup.vue';



Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'calculate',
    component: CalculateTabs,
  },
  {
    path: '/bri',
    name: 'calculate bri',
    component: CalculateTabsBri,
  },
  {
    path: '/popup/:value',
    name: 'calculate popup',
    props: true,
    component: CalculatePopup,
  },
  {
    path: "/photo-booth",
    name: 'PhotoBooth',
    props: true,
    component: PhotoBooth,
  },
  {
    path: '/spin',
    component: () => import('@/views/SpinWheel.vue')
  },
  {
    path: '/admin/spin-dashboard',
    component: () => import('@/views/SpinDashboard.vue')
  },
   {
    path: '/my-room',
    name: 'MyRoom',
    component: () => import('@/views/MyRoom.vue')
  },
  {
    path: '/ecs-land',
    name: 'EcsLand',
    component: () => import('@/views/EcsLand.vue')
  },
];

const router = new Router({
  mode: 'history',
  routes,
});

export default router;
