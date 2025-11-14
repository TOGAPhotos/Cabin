import { defineStore } from "pinia";

interface localId {
  id: string | null;
  time: number | null;
}

export const useLocalIdStore = defineStore("local_id", {
  state: (): localId => ({
    id: null,
    time: null,
  }),
  getters: {
    isAvail: (state) =>
      state.id !== null &&
      state.time &&
      Date.now() - state.time < 1000 * 60 * 60 * 24 * 15,
  },
  actions: {
    setId() {
      if (this.time && Date.now() - this.time < 1000 * 60 * 60 * 24 * 15) {
        return;
      }
      this.id = crypto.randomUUID();
      this.time = Date.now();
    },
    clearId() {
      this.id = null;
      this.time = null;
    },
  },
  persist: true,
});

export default useLocalIdStore;
