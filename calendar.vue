<template>
  <div class="calendar-wrapper">
      <div class="calendar-header">
        <div class="calendar-actions">
            <div>
                <a @click="handleYearMonthChange('year', -1)">&lt;</a>
                <a @click="handleYearMonthChange('month', -1)">&lt;&lt;</a>
            </div>
            <div class="title"><span>{{ time.year }}&nbsp;年</span><span>{{ time.month + 1 }}&nbsp;月</span></div>
            <div>
                <a @click="handleYearMonthChange('month', 1)">&gt;&gt;</a>
                <a @click="handleYearMonthChange('year', 1)">&gt;</a>
            </div>
        </div>
        <div class="calendar-weekdays">
            <span v-for="item in weekdays" :key="item">
                {{ item }}
            </span>
        </div>
      </div>
      <div class="calendar-body">
          <div 
            class="calendar-date-row"
            v-for="row in 6"
            :key="`row_${row}`"
          >
            <span 
                class="calendar-date-col"
                v-for="col in 7"
                :key="`col_${col}`"
                :class="[
                    { 'not-current-month': !isCurrentMonth(row, col)},
                    { 'is-today': isToday(row, col)},
                    { 'is-selected': isSelected(row, col) && selected}
                ]"
                @click="handleSelect(row, col)"
            >
                {{ getCalendarDate(row, col)}}
            </span>
          </div>
      </div>
      <slot name="footer"></slot>
  </div>
</template>

<script>
import * as utils from './utils'
export default {
    name: 'Calendar',
    props: {
        value: {
            type: Date,
            default: () => {}
        }
    },
    data () {
        const time = utils.getDatePanel(this.value)
        return {
            weekdays: ['日', '一', '二', '三', '四', '五', '六'],
            time,
            selected: false
        }
    },
    computed: {
        visibleDays () {
            const { year, month } = this.time // 当前时间的年月
            const firstDay = utils.getDate(year, month, 1) // 获取当月第一天的
            const weekDay = firstDay.getDay() // 获取星期
            const startDay = firstDay - weekDay * 1000 * 60 * 60 * 24 // 日历开始的第一天时间戳
            let days = []
            for (let i = 0; i < 42; i++) {
                days.push(new Date(startDay + i * 1000 * 60 * 60 * 24))
            }
            return days
        }
    },
    methods: {
        getCalendarDate (row, col) {
            const d = this.visibleDays[(row - 1) * 7 + col - 1 ]
            return d.getDate()
        },
        handleYearMonthChange (type, n) {
            const { year, month, day } = this.time
            const d = utils.getDate(year, month, day)
            if (type === 'year') {
                d.setFullYear(d.getFullYear() + n)
            } else if (type === 'month') {
                 d.setMonth(d.getMonth() + n)
            }
            this.time = utils.getDatePanel(d)
        },
        isCurrentMonth (row, col) {
            const { year, month } = utils.getDatePanel(this.visibleDays[(row - 1) * 7 + col - 1])
            const { 
                year: currentYear,
                month: currentMonth
            } = utils.getDatePanel(new Date())
            return year === currentYear && month === currentMonth
        },
        isToday (row, col) {
            const { year, month, day } = utils.getDatePanel(this.visibleDays[(row - 1) * 7 + col - 1])
            const { 
                year: currentYear,
                month: currentMonth,
                day: currentDay
            } = utils.getDatePanel(new Date())
            return year === currentYear && month === currentMonth && day === currentDay  
        },
        isSelected (row, col) {
            const { year, month, day } = utils.getDatePanel(this.visibleDays[(row - 1) * 7 + col - 1])
            const { 
                year: y,
                month: m,
                day: d
            } = utils.getDatePanel(this.value)
            return year === y && month === m && day === d
        },
        handleSelect (row, col) {
            const d = this.visibleDays[(row - 1) * 7 + col - 1]
            const { hour, minute, second } = utils.getDatePanel(new Date())
            d.setHours(hour)
            d.setMinutes(minute)
            d.setSeconds(second)
            this.time = utils.getDatePanel(d)
            this.selected = true
            this.$emit('input', d)
        }
    }
    
}
</script>

<style lang="less">
    a {
        &:link,
        &:visited,
        &:hover,
        &:active {
            color: #E44444;
        }
        color: #CDD0D4;
        text-decoration: none;
    }
    .calendar-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 8px;
        & > div > a {
            cursor: pointer;
            padding: 10px;
        }
        .title {
            span:first-child {
                margin-right: 6px;
            }
        }
    }
    .calendar-weekdays {
        display: flex;
        align-items: center;
        height: 32px;
        padding: 0 20px;
        font-size: 12px;
        font-weight: 500;
        & > span {
            flex: 1;
            margin-right: 13px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .calendar-body {
        padding: 12px 20px;
        border-bottom: 1px solid #EBECEE;
        .calendar-date-row {
            display: flex;
            margin-bottom: 8px;
            .calendar-date-col {
                flex: 1;
                color: #2A364A;
                text-align: center;
                width: 24px;
                height: 24px;
                line-height: 24px;
                margin: 4px 13px 0 0;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                &:last-child {
                    margin-right: 0;
                }
                &.not-current-month {
                    color: #CDD0D4;
                }
                &.is-today {
                    color: #E44444;
                    background-color: #fff;
                }
                &.is-selected {
                    background-color: #E44444;
                    color: #fff;
                    border-radius: 50%;
                }
            }
        }
    }
</style>