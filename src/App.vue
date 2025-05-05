<template>
	<RouterView v-slot="{ Component }">
		<Transition enter-from-class="opacity-0" enter-active-class="duration-300" enter-to-class="opacity-100"
			leave-from-class="opacity-100" leave-active-class="duration-300" leave-to-class="opacity-0">
			<component v-bind:is="Component" />
		</Transition>
	</RouterView>
</template>