import Vue from 'vue'
import VueRouter from 'vue-router';
import router from './routes';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import App from './App.vue'

window.axios = axios;

Vue.use(VueRouter);
Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    router
}).$mount('#app');
