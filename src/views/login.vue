<template>
	<div class="h-screen bg-gradient-to-b from-[#292929] to-black from-10% to-80% flex items-center justify-center">
		<div class="w-[734px] h-[740px] bg-[#121212] rounded-2xl flex items-center py-8 px-24 flex-col">
			<!-- Start Spotify logo -->
			<RouterLink to="/">
				<Icon icon="mdi:spotify" class="text-white transition cursor-pointer size-14 hover:text-green-500 " />
			</RouterLink>
			<!-- End Sportfy logo -->

			<!-- Start login header -->
			<h1 class="pt-2 text-4xl font-bold text-white">Login to Spotify</h1>
			<!-- End login header -->

			<!-- Start login methods -->
			<SigninMethods />
			<!-- End login methods -->

			<hr class="w-full text-gray-500 opacity-15">

			<!-- Start login form -->
			<form class="flex flex-col w-[350px] py-8">
				<label for="login-username" class="pb-1 text-lg font-bold text-white">Email or username</label>
				<input type="text" id="login-username" placeholder="Email or username"
					class="p-3 text-white bg-transparent border border-gray-500 rounded-md placeholder:text-sm">
				<button
					class="p-4 mt-6 font-bold text-black bg-green-500 rounded-full hover:scale-105 transition ease-in  hover:bg-[#3be477]">Continue</button>
			</form>
			<!-- End login form -->

			<!-- Start sign up link -->
			<div class="flex flex-row items-center">
				<p class="text-[#aeaeae]">Don't have an account?</p>
				<RouterLink to="/signup"
					class="pl-4 font-semibold text-white underline transition underline-offset-2 hover:text-green-500">
					Sign up for Spotify</RouterLink>
			</div>
			<!-- End sign up link -->
		</div>
	</div>
</template>

<script>
	import SigninMethods from '@/components/signinMethods.vue';
	import { Icon } from '@iconify/vue';

	export default {
		components: {
			Icon,
			SigninMethods
		}
	}
</script>