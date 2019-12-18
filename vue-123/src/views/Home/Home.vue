<template>
  <div class="home-con">
    <SearchBox />
    <MarkBox />
  </div>
</template>

<script>
// @ is an alias to /src
import SearchBox from '@/components/SearchBox/SearchBox.vue'
import MarkBox from '@/components/MarkBox/MarkBox.vue'

export default {
  name: 'home',
  components: {
    SearchBox,
    MarkBox,
  }
}
</script>
<style scoped lang="scss" src="./Home.scss"></style>
