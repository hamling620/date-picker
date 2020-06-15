<template>
  <div class="app">
     <!-- <date-picker v-model="value"></date-picker> -->
     <calendar v-model="value"/>
     <span>{{ value.toLocaleString() }}</span>
     <div>hello world</div>
  </div>
</template>

<script>
// import DatePicker from './date-picker'
import Calendar from './calendar.vue'
export default {
    components: {
        // DatePicker,
        Calendar
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