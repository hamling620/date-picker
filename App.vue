<template>
  <div class="app">
     <date-picker v-model="value"></date-picker>
     <span>{{ value.toLocaleString() }}</span>
     <div>hello world</div>
  </div>
</template>

<script>
import DatePicker from './date-picker'
export default {
    components: {
        DatePicker
    },
    data () {
        return {
            value: new Date()
        }
    }
}
</script>

<style lang="less">
    .app {
        padding: 50px;
    }
</style>