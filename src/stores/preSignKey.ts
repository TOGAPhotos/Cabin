import ServerRequest from "@/utils/request";
import { defineStore } from "pinia";

interface PreSignKey {
  preSign: string;
  expire: number;
}

const preSignKey = defineStore("preSignKey", {
  state: (): PreSignKey => ({
    preSign: "",
    expire: 0,
  }),
  getters: {
    key: (state) => state.preSign,
    isValid: (state) => state.expire > Date.now(),
  },
  actions: {
    async fetchKey() {
      const req = new ServerRequest("GET", "/servex/cdn/preSign");
      await req.send();
      this.preSign = req.getData("preSign");
      this.expire = Date.now() + 3600 * 1000 * 23; // 23 hours
    },
    async getValidKey() {
      console.log(this.isValid, this.expire, Date.now());
      if (!this.isValid) {
        await this.fetchKey();
      }
      return this.preSign;
    },
  },
});

export default preSignKey;
