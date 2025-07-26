<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

interface HorizontalScrollProps {
  bleeding?: boolean;
  align?: "start" | "end";
  steps?: number;
  className?: string;
  outerClassName?: string;
  autoScroll?: boolean;
}

const props = defineProps<HorizontalScrollProps>();
const containerRef = ref<HTMLDivElement | null>(null);
const scrollRef = ref<HTMLDivElement | null>(null);
const height = ref(0);
const bleeding = ref(props.bleeding);

const scrollMode = ref<"none" | "left" | "right" | "both">("none");

const isHovering = ref(false);
const autoScrollInterval = ref<number | null>(null);
const scrollDirection = ref<"right" | "left">("right");

function updateScrollMode() {
  const el = scrollRef.value;
  if (!el) {
    scrollMode.value = "none";
    return;
  }
  const { scrollLeft, offsetWidth, scrollWidth } = el;
  const parentWidth = el.parentElement?.offsetWidth || offsetWidth;
  const isAtStart = scrollLeft <= 0;
  const isAtEnd = Math.ceil(scrollLeft + parentWidth) >= scrollWidth;
  if (isAtStart && isAtEnd) scrollMode.value = "none";
  else if (isAtStart) scrollMode.value = "left";
  else if (isAtEnd) scrollMode.value = "right";
  else scrollMode.value = "both";
}

function updateHeight() {
  if (scrollRef.value) {
    height.value = scrollRef.value.offsetHeight;
  }
}

function handleMouseEnter() {
  isHovering.value = true;
}
function handleMouseLeave() {
  isHovering.value = false;
}

function autoScrollFn() {
  const el = scrollRef.value;
  if (!el) return;
  if (isHovering.value) return;
  const scrollWidth = el.scrollWidth;
  const offsetWidth = el.offsetWidth;
  const scrollLeft = el.scrollLeft;

  if (scrollDirection.value === "right") {
    el.scrollLeft += 1;
    if (scrollLeft >= scrollWidth - offsetWidth) {
      scrollDirection.value = "left";
    }
  } else {
    el.scrollLeft -= 1;
    if (scrollLeft <= 0) {
      scrollDirection.value = "right";
    }
  }
}

onMounted(() => {
  nextTick(() => {
    updateHeight();
    updateScrollMode();
    if (props.align === "end" && scrollRef.value) {
      scrollRef.value.scrollTo({
        left: scrollRef.value.scrollWidth - scrollRef.value.clientWidth,
        behavior: "auto",
      });
    }
    if (scrollRef.value) {
      const resizeObserver = new window.ResizeObserver(() => {
        updateHeight();
      });
      resizeObserver.observe(scrollRef.value);
    }
  });
  window.addEventListener("resize", () => {
    updateHeight();
    updateScrollMode();
  });
});

watch(scrollRef, () => {
  updateHeight();
  updateScrollMode();
});

watch(
  () => props.autoScroll,
  (val) => {
    if (val) {
      if (autoScrollInterval.value) clearInterval(autoScrollInterval.value);
      autoScrollInterval.value = window.setInterval(autoScrollFn, 20);
    } else {
      if (autoScrollInterval.value) clearInterval(autoScrollInterval.value);
      autoScrollInterval.value = null;
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (autoScrollInterval.value) clearInterval(autoScrollInterval.value);
});
</script>

<template>
  <div
    :class="[
      !bleeding || scrollMode === 'none' ? 'relative' : '',
      props.outerClassName,
    ]"
  >
    <div :style="{ height: height + 'px' }" />
    <div
      ref="containerRef"
      :class="[
        'absolute pb-4 flex flex-col gap-6 md:gap-12',
        bleeding ? 'w-screen left-1/2 -translate-x-1/2' : 'w-full',
        props.outerClassName,
      ]"
      :style="{ marginTop: `-${height}px` }"
    >
      <div
        ref="scrollRef"
        @scroll="updateScrollMode"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :class="[
          'py-2 flex gap-x-4 no-scrollbar overflow-y-scroll *:shrink-0',
          !autoScroll && 'md:snap-x md:snap-mandatory',
          bleeding &&
            'px-4 scroll-px-4 desktop:px-[calc((100vw-78rem)/2)] desktop:scroll-px-[calc((100vw-78rem)/2)]',
          props.align === 'start' ? 'md:*:snap-start' : 'md:*:snap-end',
          props.className,
        ]"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
