<script setup>

</script>
<template>
   <div class="py-8 space-y-10 text-[#FFFF]">
        <div class="px-8 overflow-auto scrollbar-style h-[calc(100vh-190px)]">

            <div class="text-[#FFE5D6] mb-20 ">            
                <div class="flex flex-row gap-6 ">     

                   <div class="relative flex-1 max-w-md">
                        <h2 class="mb-1 text-2xl font-semibold">Top result</h2>
                        <div class="bg-[#2a2a2a] hover:bg-[#333] transition rounded-lg p-4 cursor-pointer relative group">
                            <button
                                class="absolute bottom-6 right-6 flex items-center justify-center w-16 h-16 rounded-full bg-[#BC4D15] hover:bg-black transition-all 
                                        opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                                <span class="text-black ml-0.5 text-4xl hover:text-[#BC4D15]">▶</span>
                            </button>
                            <div class="items-start space-y-3 mb-9">
                                <div class="relative w-24 h-24 overflow-hidden rounded-md bg-zinc-700">
                                    <img class="object-cover w-full h-full rounded-xl" src="" alt="">                                 
                                </div>                          
                                <div class="">
                                    <h3 class="text-2xl font-bold">Bück dich</h3>
                                    <p class="mt-1 text-sm text-gray-400">
                                        Song • <span class="font-semibold">Rammstein</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 ">
                        <h2 class="mb-1 text-2xl font-semibold ">Songs</h2>
                        <div class="pr-8 mt-3">
                            <div v-for="i in 4" :key="i" class="flex items-center justify-between hover:bg-[#2a1d18] p-2 rounded-lg transition cursor-pointer ">
                                <div class="flex items-center space-x-4">
                                    <div class="w-10 h-10 rounded-md bg-zinc-700">
                                        <img class="object-cover w-full h-full rounded-xl" >
                                    </div>
                                    <span class="font-medium ">Bài hát {{ i }}</span>
                                </div>
                                <div class="flex items-center space-x-8 text-sm">
                                    <span>3:0{{ i }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                                      
                </div>
            </div>


            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Artists</h2>
                <div class="flex space-x-4 overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max">
                        <div v-for="i in 10" :key="i" class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 ">          
                            <div class="w-48 h-48 mb-2 rounded-full bg-zinc-700">
                                <img class="object-cover w-48 h-48 rounded-full" >
                            </div>
                            <p class="font-medium ">???{{ i }}</p>
                            <p class="text-sm ">{{ i * 100 }} ???</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Albums</h2>
                <div class="w-full overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max ">
                        <div v-for="i in 10" :key="i" class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 ">          
                            <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700">
                                <img class="object-cover w-48 h-48 rounded-xl" >
                            </div>
                            <p class="font-medium ">???{{ i }}</p>
                            <p class="text-sm ">{{ i * 100 }} ???</p>
                        </div>
                    </div>
                </div> 
            </div>

            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Playlists</h2>
                <div class="w-full overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max ">
                        <div v-for="i in 10" :key="i" class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 ">          
                            <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700">
                                <img class="object-cover w-48 h-48 rounded-xl" >
                            </div>
                            <p class="font-medium ">???{{ i }}</p>
                            <p class="text-sm ">{{ i * 100 }} ???</p>
                        </div>
                    </div>
                </div> 
            </div>

            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Profiles</h2>
                <div class="flex space-x-4 overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max">
                        <div v-for="i in 10" :key="i" class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 ">          
                            <div class="w-48 h-48 mb-2 rounded-full bg-zinc-700">
                                <img class="object-cover w-48 h-48 rounded-full" >
                            </div>
                            <p class="font-medium ">???{{ i }}</p>
                            <p class="text-sm ">{{ i * 100 }} ???</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-[#FFE5D6] mb-8">
                <h2 class="mb-1 text-2xl font-semibold">Genres&Moods</h2>
                <div class="w-full overflow-x-auto scrollbar-style">
                    <div class="flex px-1 py-2 space-x-4 w-max ">
                        <div v-for="i in 10" :key="i" class="flex-shrink-0 w-48 px-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:scale-105 ">          
                            <div class="w-48 h-48 mb-2 rounded-xl bg-zinc-700">
                                <img class="object-cover w-48 h-48 rounded-xl" >
                            </div>
                            <p class="font-medium ">???{{ i }}</p>
                            <p class="text-sm ">{{ i * 100 }} ???</p>
                        </div>
                    </div>
                </div> 
            </div>       
        </div>
    </div>
</template>