<script setup lang="ts">
const props = defineProps({
  label:String,
  value: String,
  link:String
})
</script>

<template>
<div class="info-label">
  <div class="label"><span style="background: #001A38; padding: 2px 9px">{{props.label}}</span></div>
  <div class="value" v-if="props.link"><a class="link" :href="props.link" v-html="props.value"></a></div>
  <div class="value" v-else><span>{{props.value}}</span></div>
</div>
</template>

<style scoped>
.info-label{
  margin-bottom: 0.6em;

}
.value{
  min-height: 1em;
}
.label{
  font-size: 0.8rem;
  font-weight: bolder;
  margin-bottom: 0.4rem;
  color: white;
}
.value a{
  font-size: 0.8rem;
  color: black;
}
.value a.link:hover{
  padding: 0 3px;
  color: white;
  background: #001A38;
}

</style>