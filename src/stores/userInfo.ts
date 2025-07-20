import { defineStore } from "pinia";

export interface UserInfo {
  username: string;
  email: string;
  token: string | null;
  expireTime: number;
  permission: string;
  id: number;
  notam?: number;
}

const useUserInfoStore = defineStore("toga_user_info_main", {
  state: (): UserInfo => ({
    username: "",
    email: "",
    token: null,
    expireTime: 0,
    permission: "",
    id: -1,
    notam: -1,
  }),
  getters: {
    isLoggedIn: (state) =>
      state.token !== null && state.expireTime > Date.now(),
  },
  actions: {
    setUserInfo({
      id,
      username,
      email,
      token,
      expireTime,
      permission,
    }: UserInfo) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.token = token;
      this.expireTime = expireTime;
      this.permission = permission;
    },
    clearUserInfo() {
      this.id = -1;
      this.username = "";
      this.email = "";
      this.token = "";
      this.expireTime = 0;
      this.permission = "";
      this.notam = -1;
    },
  },
  persist: true,
});

export default useUserInfoStore;
