import { defineStore } from 'pinia';

type UserInfo = {
    username: string,
    token: string | null,
    expireTime: number,
    permission: string,
    id:number
}

const useUserInfoStore = defineStore('userInfo', {
    state: ():UserInfo => ({
        username: '',
        token: null,
        expireTime: 0,
        permission: '',
        id:-1,
    }),
    getters: {
        isLoggedIn: state => state.token !== null && state.expireTime > Date.now(),
    },
    actions: {
        setUserInfo(id:number,username: string, token: string, expireTime: number, permission: string) {
            this.id = id;
            this.username = username;
            this.token = token;
            this.expireTime = expireTime;
            this.permission = permission;
        },
        clearUserInfo() {
            this.id = -1;
            this.username = '';
            this.token = '';
            this.expireTime = 0;
            this.permission = '';
        }
    },
    persist: true
});

export default useUserInfoStore