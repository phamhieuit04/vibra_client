import { defineStore } from "pinia";

const useAuthStore = defineStore("auth", {
	state: () => {
		return {
			isLoggedIn: false,
			user: {},
		};
	},
	actions: {
		setIsLoggedIn(isLoggedIn) {
			this.isLoggedIn = isLoggedIn;
		},
		setUser(user) {
			this.user = user;
		},
	},
	persist: true,
});

export { useAuthStore };
