<template>
  <div class="home-con">
    <SearchBox />
  </div>
</template>

<script>
// @ is an alias to /src
import SearchBox from '@/components/SearchBox/SearchBox.vue'

export default {
  name: 'home',
  components: {
    SearchBox
  }
}
</script>
<style scoped lang="scss" src="./Home.scss"></style>
