<template>
	<div class="bg-[#121212] h-screen flex items-center justify-center">
		<div class="flex flex-col items-center w-96">
			<!-- Start signup header -->
			<RouterLink to="/">
				<Icon icon="mdi:spotify" class="text-white transition cursor-pointer size-14 hover:text-green-500 " />
			</RouterLink>
			<h1 class="text-5xl font-bold text-center text-white">Sign up to</h1>
			<h1 class="text-5xl font-bold text-center text-white">start listening</h1>
			<!-- End signup header -->

			<!-- Start signup form -->
			<form class="flex flex-col w-[350px] py-8">
				<label for="login-username" class="pb-1 text-lg font-medium text-white">Email address</label>
				<input type="text" id="login-username" placeholder="name@domain.com"
					class="p-3 text-white bg-transparent border border-gray-500 rounded-md placeholder:text-sm">
				<a class="pt-2 font-semibold text-green-500 underline transition underline-offset-2 hover:text-green-300"
					href="#">Use phone nummber instead</a>
				<button
					class="p-4 mt-6 font-bold text-black bg-green-500 rounded-full hover:scale-105 transition ease-in  hover:bg-[#3be477]">Next</button>
			</form>
			<!-- End signup form -->

			<div class="flex items-center justify-center gap-4">
				<hr class="text-gray-500 w-[150px] opacity-15">
				<span class="text-white">or</span>
				<hr class="text-gray-500 w-[150px] opacity-15">
			</div>

			<!-- Start signup methods -->
			<ul class="py-8">
				<li class="mb-2">
					<button v-on:click="googleSignInPopup(googleProvider)"
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
			<!-- End signup methods -->

			<div class="w-full px-[18px] pb-8">
				<hr class="text-gray-500 opacity-15">
			</div>

			<!-- Start login link -->
			<div class="flex flex-row items-center">
				<p class="text-[#aeaeae]">Already have an account?</p>
				<RouterLink to="/login"
					class="pl-4 font-semibold text-white underline transition underline-offset-2 hover:text-green-500"
					href="#">Login in here</RouterLink>
			</div>
			<!-- End login link -->
		</div>
	</div>
</template>

<script>
	import { Icon } from '@iconify/vue';
	import axios from 'axios';
	import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	export default {
		data() {
			return {
				googleProvider: new GoogleAuthProvider(),
				auth: new getAuth()
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
						localStorage.setItem('token', apiRes.data.data.token);
						this.$router.push('/');
					}
				}).catch((apiError) => {
					console.log(apiError);
					alert("Call API thất bại");
				})
			},
			googleSignInPopup(provider) {
				signInWithPopup(this.auth, provider)
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