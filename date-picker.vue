<template>
  <div class="date-picker-wrapper" v-click-outside>
      <input type="text" :value="formatDate" :class="{focus: isOpend}">
      <div class="panel" v-if="isOpend">
          <div class="panel-header">
              <span @click="changeYear(-1)">&lt;</span>
              <span @click="changeMonth(-1)">&lt;&lt;</span>
              <span>{{ time.year }}年</span>
              <span>{{ time.month + 1 }}月</span>
              <span @click="changeMonth(1)">&gt;&gt;</span>
              <span @click="changeYear(1)">&gt;</span>
          </div>
          <div class="panel-body">
              <span v-for="row in 6" :key="`row_${row}`" class="panel-row">
                  <span 
                    class="panel-col"
                    v-for="col in 7" :key="`col_${col}`"
                    :class="[
                        { 'not-current-month': !isCurrentMonth(row, col)},
                        { 'is-selected': isSelected(row, col)},
                        { 'is-current-day': isCurrentDay(row, col)}
                    ]"
                    @click="handleSelect(row, col)"
                  >
                    {{ getDate(row, col)}}
                  </span>
              </span>
          </div>
          <div class="panel-footer">
              今日
          </div>
      </div>
  </div>
</template>

<script>
import * as utils from './utils'
export default {
    name: 'DatePicker',
    props: {
        value: {
            type: Date,
            default: () => new Date()
        }
    },
    directives: {
        clickOutside: {
            bind (el, bindings, vnode) {
                const handler = e => {
                    if (el.contains(e.target)) {
                        if (!vnode.context.isOpend) {
                            vnode.context.handleFocus()
                        }
                        
                    } else {
                        if (vnode.context.isOpend) {
                            vnode.context.handleBlur()
                        }
                    }
                }
                el.handler = handler
                document.addEventListener('click', el.handler)
            },
            unbind (el) {
                document.removeEventListener('click', el.handler)
            }
        }
    },
    computed: {
        formatDate () {
            const { year, month, day } = utils.getYearMonthDay(this.value)
            return `${year}-${month + 1}-${day}`
        },
        visibleDays () {
            const { year, month } = this.time // 当前选择的年月
            const firstDay = utils.getDate(year, month, 1) // 获取当月第一天
            const day = firstDay.getDay() // 获取星期
            const start = firstDay - day * 24 * 60 * 60 * 1000 // 日历开始一天的毫秒数
            let result = []
            for (let i = 0; i < 42; i++) {
                result.push(new Date(start + 24 * 60 * 60 * 1000 * i))
            }
            return result
        }
    },
    data () {
        const time = utils.getYearMonthDay(this.value)
        return {
            isOpend: false,
            time
        }
    },
    methods: {
        handleFocus () {
            this.isOpend = true
        },
        handleBlur () {
            this.isOpend = false
        },
        getDate (row, col) {
            const d = this.visibleDays[(row - 1) * 7 + col - 1]
            return d.getDate()
        },
        isCurrentMonth (row, col) {
            const d = this.visibleDays[(row - 1) * 7 + col - 1]
            const { year, month } = utils.getYearMonthDay(d)
            return year === this.time.year && month === this.time.month
        },
        isSelected (row, col) {
            const d = this.visibleDays[(row - 1) * 7 + col - 1]
            const { year, month, day } = utils.getYearMonthDay(d)
            return year === this.time.year && month === this.time.month && day === this.time.day   
        },
        isCurrentDay (row, col) {
            const d = this.visibleDays[(row - 1) * 7 + col - 1]
            const { year, month, day } = utils.getYearMonthDay(d)
            const { 
                year: currentYear, 
                month: currentMonth, 
                day: currentDay 
            } = utils.getYearMonthDay(new Date())

            return year === currentYear && month === currentMonth && day === currentDay
        },
        handleSelect (row, col) {
            const d = this.visibleDays[(row - 1) * 7 + col - 1]
            this.$emit('input', d)
            this.time = utils.getYearMonthDay(d)
            this.isOpend = false
        },
        changeMonth (n) {
            const d = utils.getDate(this.time.year, this.time.month, this.time.day)
            d.setMonth(d.getMonth() + n)
            this.time = utils.getYearMonthDay(d)
        },
        changeYear (n) {
            const d = utils.getDate(this.time.year, this.time.month, this.time.day)
            d.setFullYear(d.getFullYear() + n)
            this.time = utils.getYearMonthDay(d)
        }
    }
}
</script>

<style lang="less">
@primary: #2ab561;
@border-color: #eaeaea;
@sub: #f40;
* {
    margin: 0;
    padding: 0;
}
.date-picker-wrapper {
    position: relative;
    display: inline-block;
    input {
        height: 36px;
        line-height: 36px;
        text-indent: 2em;
        font-size: 16px;
        border: 1px solid @border-color;
        outline: 0;
        &.focus,
        &:focus,
        &:hover {
            border: 1px solid @primary; 
        }
    } 
    .panel {
        position: absolute;
        z-index: 3;
        top: 38px;
        left: 0;
        padding: 10px;
        border: 1px solid @primary;
        background-color: #fff;
        box-shadow: 0 1px 6px rgba(42, 181, 97, .2);
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                cursor: pointer;
            }
        }
        .panel-body {
            .panel-row {
                display: flex;
            }
            .panel-col {
                display: inline-block;
                width: 32px;
                text-align: center;
                cursor: pointer;
                &.not-current-month {
                    color: #c5c8ce;
                }
                &.is-selected {
                    color: @primary;
                }
                &.is-current-day {
                    color: #fff;
                    background-color: @primary;
                }
            }
        }
        .panel-footer {
            text-align: center;
        }
    }   
}
</style>