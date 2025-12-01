import { defineStore } from "pinia";

interface localId {
  id: string | null;
  time: number | null;
}
const TRACE_ALIVE_TIME = 1000 * 60 * 60 * 12; // 12 hours

export const useLocalIdStore = defineStore("local_id", {
  state: (): localId => ({
    id: null,
    time: null,
  }),
  getters: {
    isAvail: (state) =>
      state.id !== null &&
      state.time &&
      Date.now() - state.time < TRACE_ALIVE_TIME,
  },
  actions: {
    setId() {
      if (this.time && Date.now() - this.time < TRACE_ALIVE_TIME) {
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
