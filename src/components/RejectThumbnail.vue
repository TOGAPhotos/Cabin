<script setup lang="ts">
import { ThumbnailUrl } from "@/utils/photo-url";
import { computed } from "vue";

interface ThumbnailData {
  id: number;
  reg: string;
  // airline: string,
  reason: string;
  // airType?:string,
  comment?: string;
}

const props = defineProps<ThumbnailData>();
const url = computed(() => ThumbnailUrl(props.id));
const _reason = computed(() => (props.reason ? props.reason.split(",") : []));
</script>
<template>
  <div class="thumbnail">
    <img :src="url" :alt="props.reg" loading="lazy" />
    <div class="info-area">
      <div class="info-area-row">
        <div class="round outer blue">
          <div class="round inner blue"></div>
        </div>
        ID:{{ id }} | {{ reg }}
      </div>
      <div class="info-area-row">
        <div class="round outer yellow">
          <div class="round inner yellow"></div>
        </div>
        原因：
        <span v-for="r in _reason" :key="r" class="rej-reason">{{ r }}</span>
      </div>
      <div class="info-area-row">
        <div class="round outer yellow">
          <div class="round inner yellow"></div>
        </div>
        审图留言：{{ comment }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.thumbnail {
  margin: 3px 6px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 3%;
  height: fit-content;
}

@media only screen and (max-width: 701px) {
  .thumbnail {
    width: calc(50% - 12px);
  }
}

@media only screen and (min-width: 701px) {
  .thumbnail {
    width: calc(25% - 12px);
  }
}

.thumbnail img {
  width: 100%;
  aspect-ratio: 16/9;
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
  min-height: 1rem;
  text-wrap: wrap;
  flex-wrap: wrap;
}
.blue {
  background: #0984e3;
}

.round {
  border-radius: 50%;
}

.round.outer {
  --diameter: 0.6rem;
  width: var(--diameter);
  height: var(--diameter);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.7rem;
}

.round.inner {
  width: 0.45rem;
  height: 0.45rem;
  border: 0.07rem solid white;
}

.rej-reason,
.yellow {
  background-color: #e6a23c;
}
.rej-reason {
  color: white;
  padding: 0 0.3rem;
  margin: 0.1rem 0.1rem 0 0.1rem;
  border-radius: 0.3rem;
}
</style>
