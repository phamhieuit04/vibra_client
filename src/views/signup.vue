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
			<SigninMethods />
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
	import SigninMethods from '@/components/signinMethods.vue';
	import { Icon } from '@iconify/vue';

	export default {
		components: {
			Icon,
			SigninMethods
		}
	}
</script>