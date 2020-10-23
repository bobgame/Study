<template>
  <div class="calendar-box">
    <div class="title">日历</div>
    <ul>
      <li class="list-title">
        <div class="day">日</div>
        <div class="day">一</div>
        <div class="day">二</div>
        <div class="day">三</div>
        <div class="day">四</div>
        <div class="day">五</div>
        <div class="day">六</div>
      </li>
      <li v-for="(week, index) in weeks" :key="'week-' + index">
        <div
          class="day"
          v-bind:class="{
            'is-not-current': !weekDay.current,
            'is-today': weekDay.today,
            'is-weekend': ind % 7 === 0 || ind % 7 === 6
          }"
          v-for="(weekDay, ind) in week"
          :key="'week-day-' + ind"
        >
          <div class="label">{{ weekDay.label }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import store from '../../store'
import { WeekDay } from '../../interface/calendar.interface'

@Component({
  components: {}
})
export default class Calendar extends Vue {
  year = 2020
  month = 9
  day = 23
  weeks: WeekDay[][] = []

  private get name() {
    return store.state.name
  }

  mounted() {
    const d = new Date()
    this.year = d.getFullYear()
    this.month = d.getMonth()
    this.day = d.getDate()
    const y = this.year
    const m = this.month
    // 本月第一天
    const firstDayOfMonth = new Date(y, m, 1).getDay()
    // 本月最后一天
    const lastDateOfMonth = new Date(y, m + 1, 0).getDate()
    // 上个月最后一天
    const lastDayOfPreMonth =
      m === 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate()

    let week: WeekDay[] = []

    // 月第一=几天
    let i = 1
    do {
      let dow = new Date(y, m, i).getDay()

      // 周日则单独一行
      if (dow === 0) {
        week = []
      }
      // 每月第一天关于上个月尾数几天当月显示处理
      else if (i === 1) {
        let k = lastDayOfPreMonth - firstDayOfMonth + 1
        for (let j = 0; j < firstDayOfMonth; j++) {
          const obj: WeekDay = {
            label: k
          }
          week.push(obj)
          k++
        }
      }

      // 查询当天，高亮处理
      const chk = new Date()
      const chkY = chk.getFullYear()
      const chkM = chk.getMonth()
      if (chkY === this.year && chkM === this.month && i === this.day) {
        week.push({
          label: i,
          // 本月
          current: true,
          today: true
        })
        // 其他本月常规天
      } else {
        week.push({
          label: i,
          // 本月
          current: true
        })
      }
      // 周六则闭合
      if (dow === 6) {
        this.weeks.push(week)
      }
      // 本月最后一天，处理下个月首几日在当月内显示
      else if (i === lastDateOfMonth) {
        let k = 1
        for (dow; dow < 6; dow++) {
          const obj = {
            label: k
          }
          week.push(obj)
          k++
        }
        this.weeks.push(week)
      }

      i++
    } while (i <= lastDateOfMonth)
  }
  // 销毁document的点击事件
  beforeDestroy() {
    // document.removeEventListener("click", e => {
    //   this.showSelectBox = false;
    // });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" src="./Calendar.scss"></style>
