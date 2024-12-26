import { createApp } from "vue";

import App from "./App.vue";
import router from "./router.js";
import store from "./store/index.js";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Toast from 'vue-toastification';
// Import the CSS for the plugin
import 'vue-toastification/dist/index.css';

library.add([faBars,faBell])

const app = createApp(App);

app.use(Toast);
app.use(router);
app.use(store);

  

app.component('font-awesome-icon', FontAwesomeIcon);


app.mount("#app");
