<template>
    <ul class="py-8">
        <li class="mb-2">
            <button v-on:click="
                (getDeviceToken(), firebaseSignInPopup(googleProvider))
                "
                class="flex h-[52px] w-[350px] items-center rounded-full border border-gray-500 pl-9 transition duration-300 hover:border-white">
                <Icon icon="devicon:google" class="size-6" />
                <p class="pl-9 text-lg font-bold text-white">
                    Đăng nhập với Google
                </p>
            </button>
        </li>
        <li class="mb-2">
            <button v-on:click="
                (getDeviceToken(), firebaseSignInPopup(facebookProvider))
                "
                class="flex h-[52px] w-[350px] items-center rounded-full border border-gray-500 pl-9 transition duration-300 hover:border-white">
                <Icon icon="logos:facebook" class="size-6" />
                <p class="pl-9 text-lg font-bold text-white">
                    Đăng nhập với Facebook
                </p>
            </button>
        </li>
    </ul>
</template>

<script>
import axios from 'axios';
import { Icon } from '@iconify/vue';
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { getMessaging, getToken } from 'firebase/messaging';
import { fcmKeyPair } from '@/services/firebase';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

export default {
    setup() {
        const authStore = useAuthStore();
        const isLoading = ref(false);

        return { authStore };
    },
    data() {
        return {
            googleProvider: new GoogleAuthProvider(),
            facebookProvider: new FacebookAuthProvider(),
            firebaseAuth: new getAuth(),
            messaging: new getMessaging(),
            deviceToken: '',
        };
    },
    created() {
        this.googleProvider.setCustomParameters({
            prompt: 'select_account',
        });
    },
    components: {
        Icon,
    },
    methods: {
        firebaseSignInPopup(provider) {
            signInWithPopup(this.firebaseAuth, provider)
                .then((authRes) => {
                    this.callAuthAPI(authRes);
                })
                .catch((authError) => {
                    console.log(authError);
                });
        },
        async callAuthAPI(authRes) {
            this.isLoading = true;
            await axios
                .get('http://spotify_clone_api.test/api/firebase/auth', {
                    params: {
                        email: authRes.user.email,
                        device_token: this.deviceToken,
                    },
                })
                .then((apiRes) => {
                    if (apiRes.data.code == 200) {
                        this.authStore.setIsLoggedIn(true);
                        this.authStore.setUser(apiRes.data.data);
                        this.sendGreeting();
                        this.$router.push('/');
                        this.isLoading = false;
                    }
                })
                .catch((apiError) => {
                    console.log(apiError);
                    alert('Call API thất bại');
                });
        },
        async sendGreeting() {
            try {
                const res = await axios.get(
                    'http://spotify_clone_api.test/api/email/send-greeting',
                    {
                        headers: {
                            Authorization:
                                'Bearer ' + this.authStore.user.token,
                        },
                    },
                );
            } catch (e) {
                console.log(e);
            }
        },
        getDeviceToken() {
            getToken(this.messaging, { vapidKey: fcmKeyPair })
                .then((currentToken) => {
                    if (currentToken) {
                        this.deviceToken = currentToken;
                    } else {
                        console.log(
                            'No registration token available. Request permission to generate one.',
                        );
                    }
                })
                .catch((error) => {
                    alert('Can not get fcm device token', error);
                });
        },
    },
};
</script>
