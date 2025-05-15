<template>
	<ul class="py-8">
		<li class="mb-2">
			<button v-on:click="firebaseSignInPopup(googleProvider)"
				class="w-[350px] h-[52px] border border-gray-500 rounded-full pl-9 flex items-center hover:border-white transition duration-300">
				<Icon icon="devicon:google" class="size-6" />
				<p class="text-lg font-bold text-white pl-9">Sign up with Google</p>
			</button>
		</li>
		<li class="mb-2">
			<a href=""
				class="w-[350px] h-[52px] border border-gray-500 rounded-full pl-9 flex items-center hover:border-white transition duration-300">
				<Icon icon="logos:facebook" class="size-6" />
				<p class="text-lg font-bold text-white pl-9">Sign up with Facebook</p>
			</a>
		</li>
		<li class="mb-2">
			<a href=""
				class="w-[350px] h-[52px] border border-gray-500 rounded-full pl-8 flex items-center hover:border-white transition duration-300">
				<Icon icon="ic:baseline-apple" class="text-white size-8" />
				<p class="text-lg font-bold text-white pl-9">Sign up with Apple</p>
			</a>
		</li>
	</ul>
</template>

<script>
	import { Icon } from '@iconify/vue';
	import axios from 'axios';
	import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { useAuthStore } from '@/stores/auth';

	export default {
		setup() {
			const authStore = useAuthStore();
			return { authStore };
		},
		data() {
			return {
				googleProvider: new GoogleAuthProvider(),
				firebaseAuth: new getAuth()
			}
		},
		components: {
			Icon
		},
		methods: {
			async callAuthAPI(authRes) {
				await axios.get('http://spotify_clone_api.test/api/firebase/auth', {
					params: {
						'email': authRes.user.email
					}
				}).then((apiRes) => {
					if (apiRes.data.code == 200) {
						this.authStore.setIsLoggedIn(true);
						this.authStore.setUser(apiRes.data.data);
						this.$router.push('/');
					}
				}).catch((apiError) => {
					console.log(apiError);
					alert("Call API thất bại");
				})
			},
			firebaseSignInPopup(provider) {
				signInWithPopup(this.firebaseAuth, provider)
					.then((authRes) => {
						this.callAuthAPI(authRes);
					})
					.catch((authError) => {
						console.log(authError);
					})
			}
		}
	}
</script>