import 'tailwindcss/tailwind.css';
import './assets/index.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

library.add(faShoppingCart, faUser);

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
