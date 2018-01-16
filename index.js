import './index.css'

///<reference path="//cdn.bootcss.com/jquery/3.1.1/jquery.js" />
import Vue from 'vue/dist/vue.common';
import VueRouter from 'vue-router'

//pages
import three_model from './pages/three_model.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { 
            path: '/three_model', 
            component: three_model,
            name:'three_model',
        },
  { 
      path: '*', 
      component: three_model
  }
    ]
})

var app = new Vue({
    el: '#app',
    components:{
    },
    router:router,
    data: {
    },
    //方法
    methods:{
    },
    //页面初始化
    mounted:function(){
    }
})
