<template>
	<ul class="py-8">
		<li class="mb-2">
			<button v-on:click="getDeviceToken(), firebaseSignInPopup(googleProvider)"
				class="w-[350px] h-[52px] border border-gray-500 rounded-full pl-9 flex items-center hover:border-white transition duration-300">
				<Icon icon="devicon:google" class="size-6" />
				<p class="text-lg font-bold text-white pl-9">Đăng nhập với Google</p>
			</button>
		</li>
		<li class="mb-2">
			<button v-on:click="getDeviceToken(), firebaseSignInPopup(facebookProvider)"
				class="w-[350px] h-[52px] border border-gray-500 rounded-full pl-9 flex items-center hover:border-white transition duration-300">
				<Icon icon="logos:facebook" class="size-6" />
				<p class="text-lg font-bold text-white pl-9">Đăng nhập với Facebook</p>
			</button>
		</li>
	</ul>
</template>

<script>
	import axios from 'axios';
	import { Icon } from '@iconify/vue';
	import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
	import { getMessaging, getToken } from "firebase/messaging";
	import { fcmKeyPair } from '@/services/firebase';
	import { useAuthStore } from '@/stores/auth';

	export default {
		setup() {
			const authStore = useAuthStore();

			return { authStore };
		},
		data() {
			return {
				googleProvider: new GoogleAuthProvider(),
				facebookProvider: new FacebookAuthProvider(),
				firebaseAuth: new getAuth(),
				messaging: new getMessaging(),
				deviceToken: ""
			}
		},
		components: {
			Icon
		},
		methods: {
			firebaseSignInPopup(provider) {
				signInWithPopup(this.firebaseAuth, provider)
					.then((authRes) => {
						this.callAuthAPI(authRes);
					})
					.catch((authError) => {
						console.log(authError);
					})
			},
			async callAuthAPI(authRes) {
				await axios.get('http://spotify_clone_api.test/api/firebase/auth', {
					params: {
						'email': authRes.user.email,
						'device_token': this.deviceToken
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
			getDeviceToken() {
				getToken(this.messaging, { vapidKey: fcmKeyPair })
					.then((currentToken) => {
						if (currentToken) {
							this.deviceToken = currentToken;
						} else {
							console.log('No registration token available. Request permission to generate one.');
						}
					}).catch((error) => {
						alert('Can not get fcm device token', error);
					})
			}
		}
	}
</script>