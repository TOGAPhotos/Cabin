<script setup lang="ts">
import { ref } from 'vue';
const prop = defineProps({
    src:{type:String,required:true},
    alt:{type:String,required:false,default:''},
    className:{type:String,required:false,default:''},
    protect:{type:Boolean,required:false,default:false}
})

const onLoad = () => loading.value = false
const onError = () => loading.value = true
const loading = ref(true);

</script>
<template>
    <img 
        src="/placeholder.png" alt="loading" :class="prop.className+' loading'"
        v-show="loading"
    />
    <img 
        v-if="!prop.protect"
        :src="prop.src" :alt="prop.alt" :class="prop.className"
        @load="onLoad()" @error="onError()"
        v-show="!loading"
    />
    <div v-else>
        <img 
            :src="prop.src" :alt="prop.alt" :class="prop.className + ' protect'"
            @load="onLoad()" @error="onError()"
            oncontextmenu="return false"
            ondragstart="return false"
            v-show="!loading"
        />
        <div class="cover"></div>
    </div>
</template>
<style scoped>
.protect{
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    pointer-events:none;
}
.cover{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:none;
    z-index:1;
}
</style>
