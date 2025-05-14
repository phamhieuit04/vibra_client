import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { firebaseApp } from "./services/firebase";

const app = createApp(App);

app.use(router, firebaseApp);

app.mount("#app");
