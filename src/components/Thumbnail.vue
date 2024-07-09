<script setup lang="ts">
import {computed, ref} from "vue";
import {STATIC_RESOURCE_URL} from "@/config";

interface ThumbnailData{
  id: number,
  reg: string,
  airline: string,
  username?: string,
  airType?:string,
  airport?: {
    name: string,
    icao: string,
    iata?: string,
  }
}

const props = defineProps<ThumbnailData>();
// https://cdn.photo.tp.794td.cn/min/photos/10878.jpg

const showAirport = ref(false)
const airportLine = ref();
const url = computed(() => `${STATIC_RESOURCE_URL}/min/photos/${props.id}.jpg`);
const href = computed(() => `/photo/${props.id}`);

if (props.airport?.name) {
  showAirport.value =true;
  airportLine.value = `${props.airport.icao}-${props.airport?.name}`;
  if (props.airport.iata) {
    airportLine.value = `${props.airport.iata}/${airportLine.value}`
  }

}


</script>
<template>
  <div class="thumbnail">
    <a :href="href">
      <img :src="url" :alt="props.reg" loading="lazy">
      <div class="info-area">
        <div class="info-area-row" v-if="username">
          <div class="round outer lightblue">
            <div class="round inner lightblue">
            </div>
          </div>
            由<strong>{{ username }}</strong>拍摄
        </div>
        <div class="info-area-row">
            <div class="round outer blue">
              <div class="round inner blue">
              </div>
            </div>
<!--            <span class="info-text">-->
              <span class="airline">{{ airline }}</span> | <span class="reg">{{ reg }}</span>
<!--            </span>-->
        </div>
        <div class="info-area-row">
          <div class="round outer lightblue">
            <div class="round inner lightblue">
            </div>
          </div>
          {{ airType }}
        </div>
        <div class="info-area-row" v-if="showAirport">
          <div class="round outer blue">
            <div class="round inner blue">
            </div>
          </div>
          {{ airportLine }}
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped>
.thumbnail {
  margin: 3px 6px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 3%;
  height: fit-content;
}

.thumbnail:hover {
  box-shadow: 3px 3px 4px 4px rgba(0, 0, 0, 0.3);
}

@media only screen and (max-width: 701px) {
  .thumbnail {
    width: calc(50% - 12px)
  }
}

@media only screen and (min-width: 701px) {
  .thumbnail {
    width: calc(25% - 12px);
  }
}

.thumbnail img {
  width: 100%;
  border-radius: 3% 3% 0 0;
}

.info-area {
  padding: 0.35rem 0.3rem 0.3rem 0.7rem;
  font-size: 0.65rem;
  color: #000c17;

}

.info-area-row {
  display: flex;
  line-height: 1rem;
  align-items: center;
  min-height: 16px;
}
.blue{
  background: #0984e3;
}

.lightblue{
  background: #74b9ff;
}

.round{
  border-radius: 50%;
}

.round.outer{
  --diameter: 0.6rem;
  width: var(--diameter);
  height: var(--diameter);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.7rem;
}

.round.inner{
  width: 0.45rem;
  height: 0.45rem;
  border: 0.07rem solid white;
}

.airline{
  max-width: 53%;
}
.reg{
  max-width: 45%;
}
.airline, .reg{
  display: inline-block;
  line-height: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>