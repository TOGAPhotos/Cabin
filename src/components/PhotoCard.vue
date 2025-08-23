<script setup lang="ts">
import ImgLoader from "@/components/ImgLoader.vue";
import formatAirportString from "@/utils/airport";
import { PhotoUrl, ThumbnailUrl } from "@/utils/photo-url";
import type { AcceptPhoto } from "@/utils/type/photo";
import { computed } from "vue";

export type PhotoCardProps = AcceptPhoto & {
  highQuality?: boolean;
  showAirport?: boolean;
};

const props = defineProps<PhotoCardProps>();

const url = computed(() =>
  props.highQuality ? PhotoUrl(props.id) : ThumbnailUrl(props.id),
);
const href = computed(() => `/photo/${props.id}`);
const hasAirline = computed(() => props.airline_cn !== props.ac_type);
const isAirportPhoto = computed(() => props.airport_icao_code === props.ac_reg);
</script>

<template>
  <a class="h-fit transition-grow rounded-lg overflow-clip" :href="href">
    <div class="flex flex-col w-full h-full">
      <ImgLoader
        :src="url"
        className="w-full aspect-[2/1] md:aspect-video object-center object-cover select-none"
      />
      <div
        class="h-full relative px-2 py-1.5 bg-toga-darker text-white hover:bg-toga-dark active:bg-toga-dark group"
      >
        <div
          class="absolute w-full h-2 -top-1.75 left-0 bg-gradient-to-t from-toga-darker group-hover:from-toga-dark group-active:from-toga-dark"
        />
        <div class="w-full h-full flex flex-col justify-between text-xs">
          <div
            v-if="showAirport"
            class="*:line-clamp-1 *:text-nowrap *:text-ellipsis"
          >
            {{
              formatAirportString({
                ...(isAirportPhoto
                  ? undefined
                  : {
                      airport_cn,
                    }),
                airport_icao_code,
                airport_iata_code,
              })
            }}
          </div>
          <div
            class="flex gap-2 items-baseline justify-between *:line-clamp-1 *:text-nowrap *:text-ellipsis"
          >
            <div v-if="isAirportPhoto" class="shrink-0">
              {{
                formatAirportString({
                  airport_cn,
                  ...(isAirportPhoto
                    ? undefined
                    : {
                        airport_icao_code,
                        airport_iata_code,
                      }),
                })
              }}
            </div>
            <div v-if="!isAirportPhoto" class="shrink-0">{{ ac_reg }}</div>
            <div v-if="!isAirportPhoto" class="text-right">{{ ac_type }}</div>
          </div>
          <div
            class="flex gap-2 items-baseline justify-between *:line-clamp-1 *:text-nowrap *:text-ellipsis"
          >
            <div class="shrink-0 max-w-3/5 text-sm font-semibold">
              {{ username }}
            </div>
            <div v-if="hasAirline" class="text-right">
              {{ airline_cn ?? airline_en }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped></style>
