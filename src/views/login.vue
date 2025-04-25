<template>
	<div class="h-screen bg-gradient-to-b from-[#292929] to-black from-10% to-80% flex items-center justify-center">
		<div class="w-[734px] h-[740px] bg-[#121212] rounded-2xl flex items-center py-8 px-24 flex-col">
			<!-- Start Spotify logo -->
			<a href="#">
				<Icon icon="mdi:spotify" class="text-white transition size-14 hover:text-green-500" />
			</a>
			<!-- End Sportfy logo -->

			<!-- Start login header -->
			<h1 class="pt-2 text-4xl font-bold text-white">Login to Spotify</h1>
			<!-- End login header -->

			<!-- Start login methods -->
			<ul class="py-8">
				<li class="mb-2">
					<a href=""
						class="w-[350px] h-[52px] border border-gray-500 rounded-full pl-9 flex items-center hover:border-white transition duration-300">
						<Icon icon="devicon:google" class="size-6" />
						<p class="text-lg font-medium text-white pl-9">Continue with Google</p>
					</a>
				</li>
				<li class="mb-2">
					<a href=""
						class="w-[350px] h-[52px] border border-gray-500 rounded-full pl-9 flex items-center hover:border-white transition duration-300">
						<Icon icon="logos:facebook" class="size-6" />
						<p class="text-lg font-medium text-white pl-9">Continue with Facebook</p>
					</a>
				</li>
				<li class="mb-2">
					<a href=""
						class="w-[350px] h-[52px] border border-gray-500 rounded-full pl-8 flex items-center hover:border-white transition duration-300">
						<Icon icon="ic:baseline-apple" class="text-white size-8" />
						<p class="text-lg font-medium text-white pl-9">Continue with Apple</p>
					</a>
				</li>
				<li class="mb-2">
					<a href=""
						class="w-[350px] h-[52px] border border-gray-500 rounded-full justify-center  flex items-center hover:border-white transition duration-300">
						<p class="text-lg font-medium text-white">Continue with phone number</p>
					</a>
				</li>
			</ul>
			<!-- End login methods -->

			<hr class="w-full text-gray-500 opacity-15">

			<!-- Start login form -->
			<form class="flex flex-col w-[350px] py-8">
				<label for="login-username" class="pb-1 text-lg font-medium text-white">Email or username</label>
				<input type="text" id="login-username" placeholder="Email or username"
					class="p-3 text-white bg-transparent border border-gray-500 rounded-md placeholder:text-sm">
				<button
					class="p-4 mt-6 font-bold text-black bg-green-500 rounded-full hover:scale-105 transition ease-in  hover:bg-[#3be477]">Continue</button>
			</form>
			<!-- End login form -->

			<!-- Start sign up link -->
			<div class="flex flex-row items-center">
				<p class="text-[#aeaeae]">Don't have an account?</p>
				<a class="pl-4 font-semibold text-white underline transition underline-offset-2 hover:text-green-500"
					href="#">Sign
					up for Spotify</a>
			</div>
			<!-- End sign up link -->
		</div>
	</div>
</template>

<script>
	import { Icon } from '@iconify/vue';

	export default {
		components: {
			Icon
		}
	}
</script>