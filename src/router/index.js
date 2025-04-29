import Login from "@/views/login.vue";
import Signup from "@/views/signup.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/login",
			name: "login",
			component: Login,
		},
		{
			path: "/signup",
			name: "signup",
			component: Signup
		}
	],
});

export default router;
