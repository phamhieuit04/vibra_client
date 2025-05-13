import Index from "@/views/index.vue";
import Login from "@/views/login.vue";
import Signup from "@/views/signup.vue";
import Verify from "@/views/verify.vue";
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
		},
		{
			path: "/",
			name: "index",
			component: Index
		},
		{
			path: "/verify",
			name: "verify",
			component: Verify
		}
	],
});

export default router;
