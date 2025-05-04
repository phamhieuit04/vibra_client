<template>
	<div class=" w-[460px] fixed left-0 bottom-0 top-[68px] m-2 rounded-xl bg-[#121212] p-4 pl-5">
		<div class="flex flex-col gap-8">
			<div class="flex items-center justify-between">
				<h1 class="text-xl font-bold text-white">Your library</h1>
				<div
					class="flex items-center justify-center size-9 hover:bg-[#1e1e1e] rounded-full transition duration-200 cursor-pointer">
					<Icon icon="material-symbols:add-2" class="text-2xl text-white" />
				</div>
			</div>
			<div
				class="flex flex-col gap-6 overflow-y-auto h-[650px] pr-4 scrollbar scrollbar-thumb-[#1f1f1f] scrollbar-thumb-rounded-xl scrollbar-w-2">
				<div class="w-full bg-[#1f1f1f] h-36 p-4 pl-6 rounded-xl flex flex-col gap-4">
					<div>
						<h1 class="text-lg font-bold leading-7 text-white">Create your first playlist</h1>
						<h1 class="text-base font-medium leading-7 text-white">It's easy, we'll help you</h1>
					</div>
					<button type="button"
						class="py-2 text-sm font-bold text-center text-black transition duration-200 bg-white w-36 rounded-3xl hover:scale-105">
						Create playlist
					</button>
				</div>
				<div class="w-full bg-[#1f1f1f] h-36 p-4 pl-6 rounded-xl flex flex-col gap-4">
					<div>
						<h1 class="text-lg font-bold leading-7 text-white">Let's find some postcasts to follow</h1>
						<h1 class="text-base font-medium leading-7 text-white">We'll keep you updated on new episodes
						</h1>
					</div>
					<button type="button"
						class="py-2 text-sm font-bold text-center text-black transition duration-200 bg-white w-36 rounded-3xl hover:scale-105">
						Browse postcasts
					</button>
				</div>
				<div class="w-full bg-[#1f1f1f] h-36 p-4 pl-6 rounded-xl flex flex-col gap-4">
					<div>
						<h1 class="text-lg font-bold leading-7 text-white">Let's find some postcasts to follow</h1>
						<h1 class="text-base font-medium leading-7 text-white">We'll keep you updated on new episodes
						</h1>
					</div>
					<button type="button"
						class="py-2 text-sm font-bold text-center text-black transition duration-200 bg-white w-36 rounded-3xl hover:scale-105">
						Browse postcasts
					</button>
				</div>
				<div class="w-full bg-[#1f1f1f] h-36 p-4 pl-6 rounded-xl flex flex-col gap-4">
					<div>
						<h1 class="text-lg font-bold leading-7 text-white">Let's find some postcasts to follow</h1>
						<h1 class="text-base font-medium leading-7 text-white">We'll keep you updated on new episodes
						</h1>
					</div>
					<button type="button"
						class="py-2 text-sm font-bold text-center text-black transition duration-200 bg-white w-36 rounded-3xl hover:scale-105">
						Browse postcasts
					</button>
				</div>
				<div class="w-full bg-[#1f1f1f] h-36 p-4 pl-6 rounded-xl flex flex-col gap-4">
					<div>
						<h1 class="text-lg font-bold leading-7 text-white">Let's find some postcasts to follow</h1>
						<h1 class="text-base font-medium leading-7 text-white">We'll keep you updated on new episodes
						</h1>
					</div>
					<button type="button"
						class="py-2 text-sm font-bold text-center text-black transition duration-200 bg-white w-36 rounded-3xl hover:scale-105">
						Browse postcasts
					</button>
				</div>
			</div>
		</div>
		<button type="button"
			class="fixed flex items-center gap-2 px-3 py-1 transition duration-200 bg-black border-2 border-gray-600 rounded-full bottom-8 hover:border-white">
			<Icon icon="material-symbols:language" class="text-xl text-white" />
			<h1 class="font-bold text-white">English</h1>
		</button>
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