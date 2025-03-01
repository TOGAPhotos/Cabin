// import { ref } from "vue";
// import type { App } from "vue";

// export default {
//   install(app: App) {
//     const screenWidth = ref(window.innerWidth);

//     const updateScreenWidth = () => {
//       screenWidth.value = window.innerWidth;
//     };

//     window.addEventListener("resize", updateScreenWidth);

//     app.config.globalProperties.$screenWidth = screenWidth;
//     app.provide("screenWidth", screenWidth);
//   }
// };

// declare module "@vue/runtime-core" {
//   interface ComponentCustomProperties {
//     $screenWidth: typeof ref;
//   }
// }
