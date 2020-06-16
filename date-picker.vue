<template>
  <div class="date-picker-wrapper" v-click-outside>
      <input ref="showInput" type="text" :value="formatDateTime" class="showInput" :class="{focus: isOpend}">
      <transition name="show-calendar">
          <div class="panel" v-if="isOpend">
            <div class="date-picker-select">
                <div class="select-date">
                    <input type="text" :value="formatDate">
                </div>
                <div class="select-time">
                    <input type="text" :value="formatTime">
                    <!-- <div class="select-time-panel">
                        <div class="hour-list">
                            <ul>
                                <li v-for="item in 24" :key="item">
                                    {{ item - 1 | format }}
                                </li>
                            </ul>
                        </div>
                        <div class="minute-list">
                            <ul>
                                <li v-for="item in 60" :key="item">
                                    {{ item - 1 | format }}
                                </li>
                            </ul>
                        </div>
                        <div class="second-list">
                            <ul>
                                <li v-for="item in 60" :key="item">
                                    {{ item - 1 | format }}
                                </li>
                            </ul>
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="panel-body">
                <calendar v-model="dateValue">
                    <div slot="footer" class="pannel-footer">
                        <a>此刻</a> 
                        <button @click="confirm">确定</button>   
                    </div>
                </calendar>
            </div>
        </div>
      </transition>
  </div>
</template>

<script>
import Calendar from './calendar'
import * as utils from './utils'
export default {
    name: 'DatePicker',
    components: {
        Calendar
    },
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
                        }else {
                            // vnode.context.handleBlur()
                        }
                        
                    } 
                    else {
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
    filters: {
        format (value) {
            return value < 10 ? '0' + value : '' + value
        }
    },
    computed: {
        dateValue: {
            get: function () {
                return this.value
            },
            set: function (newVal) {
                this.$emit('input', newVal)
            }   
        },
        formatDate () {
            const { year, month, day } = utils.getDatePanel(this.value)
            return `${year}-${utils.fomatLt10(month + 1)}-${utils.fomatLt10(day)}`
        },
        formatDateTime () {
            return `${this.formatDate} ${this.formatTime}`
        }
    },
    data () {
        return {
            isOpend: false,
            time: new Date(),
            formatTime: '00:00:00'
        }
    },
    methods: {
        handleFocus () {
            this.isOpend = true
        },
        handleBlur () {
            this.isOpend = false
        },
        confirm () {
            
        }
    }
}
</script>

<style lang="less">
* {
    margin: 0;
    padding: 0;
}
ul {
    list-style: none;
}
input, button {
    outline: 0;
}
.date-picker-wrapper {
    position: relative;
    display: inline-block;
    width: 286px;
    input {
        text-indent: 12px;
        font-size: 14px;
        border: 1px solid #DADCE0;
        border-radius: 4px;
        cursor: pointer;
        &.focus,
        &:focus,
        &:hover {
            border: 1px solid #779BD3; 
        }
        &.showInput {
            width: 200px;
            height: 38px;
            line-height: 38px;
        }
    } 
    .date-picker-select {
        display: flex;
        justify-content: center;
        padding: 8px 12px;
        border-bottom: 1px solid #EBECEE;
        input {
            text-indent: 12px;
            width: 125px;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
        }
        .select-date {
            margin-right: 8px;
        }
        .select-time {
            position: relative;
            .select-time-panel {
                width: 196px;
                position: absolute;
                top: 38px;
                left: 0;
                background-color: #fff;
                z-index: 100;
                height: 224px;
                padding: 12px 0;
                overflow: hidden;
            }
            .hour-list,
            .minute-list,
            .second-list {
                float: left;
                width: 33.33%;
                height: 100%;
                text-align: center;
                overflow: scroll;
                &::-webkit-scrollbar {
                    display: none;
                }
                li {
                    cursor: pointer;
                }
            }
        }
    }
    .panel {
        position: absolute;
        z-index: 100;
        top: 44px;
        left: 0;
        background-color: #fff;
        box-shadow:0px 2px 6px 0px rgba(42,54,74,0.12);
        border-radius:4px;
        .pannel-footer {
            display: flex;
            height: 40px;
            padding: 0 16px;
            justify-content: flex-end;
            align-items: center;
            a {
                color: #E44444;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                margin-right: 16px;
            }
            button {
                color: #fff;
                font-size: 14px;
                font-weight: 500;
                height: 32px;
                line-height: 32px;
                padding: 0px 24px;
                border-radius: 24px;
                background-color: #E44444;
                user-select: none;
                cursor: pointer;
                border: 0;
            }
        }
    }  
    .show-calendar-enter-active {
        transform-origin: 0 0;
        animation: show-calendar-in .2s cubic-bezier(.23, 1, .32, 1)
    }

    .show-calendar-leave-active {
        transform-origin: 0 0;
        animation: show-calendar-out .2s cubic-bezier(.755, .05, .855, .06)
    }
    @keyframes show-calendar-in {
        from {
            opacity: 0;
            transform: scaleY(0);
        }
        to {
            opacity: 1;
            transform: scaleY(1);
        }
    }

    @keyframes show-calendar-out {
        from {
            opacity: 1;
            transform: scaleY(1);
        }
        to {
            opacity: 0;
            transform: scaleY(0);
        }
    }
}
</style>