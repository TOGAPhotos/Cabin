<script setup lang="ts">
const props = defineProps({
  label:String,
  value: String,
})
</script>

<template>
<div class="info-label">
  <div class="label"><span style="background: #001A38; padding: 2px 9px">{{props.label}}</span></div>
  <div class="value">{{props.value}}</div>
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
  font-size: 0.8em;
  font-weight: bolder;
  margin-bottom: 0.4em;
  color: white;
}

</style>