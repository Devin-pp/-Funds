import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Register from './views/Register.vue'
import NotFind from './views/404.vue'
import Login from './views/Login.vue'
import Home from "./views/Home.vue"
import InfoShow from './views/InfoShow.vue'
import FundsList from './views/FundsList.vue'


Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      {  path:'*', name:'/404', component:NotFind},
      {   path:'/login', name:'login', component:Login},
      {   path: '/register', name: 'register', component: Register},
      {  path: '/', redirect: '/login' },
      {  path:'/index', component:Index,
         children:[
             { path:'', component: Home },
             { path: '/home', name: 'home', component: Home },
             { path:'/infoShow', name:'InfoShow', component: InfoShow },
             { path:'/fundsList', name:'FundsList', component: FundsList },
         ]
     },



    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: function () {
    //     return import(/* webpackChunkName: "about" */ './views/About.vue')
    //   }
    // }
  ]
});

//路由守卫
router.beforeEach((to,from,next) =>{
   //判断 token 是否 存在 localStorage
    const isLogin = localStorage.eleToken ? true : false;
    if(to.path =='/login' || to.path =='/register'){
        next();
    }else {
        isLogin ? next() : next("/login");
    }
});

export default router;

