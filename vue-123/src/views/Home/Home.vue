<template>
  <div class="home-con">
    <SearchBox />
    <MarkBox v-if="name" />
    <!-- <Calendar /> -->
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator'
import SearchBox from '@/components/SearchBox/SearchBox.vue'
import MarkBox from '@/components/MarkBox/MarkBox.vue'
import Calendar from '@/components/Calendar/Calendar.vue'
import store from '../../store/index'

@Component({
  components: {
    SearchBox,
    MarkBox,
    Calendar
  }
})
export default class Home extends Vue {
  get name() {
    return store.state.name
  }
}
</script>
<style scoped lang="scss" src="./Home.scss"></style>
