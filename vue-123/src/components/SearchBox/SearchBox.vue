<template>
  <div class="search">
    <div class="input-box">
      <div id="search-select" class="search-select">
        <div
          class="search-select-show"
          @click.stop="showSelectBox = !showSelectBox"
        >{{searchUsed.name}}</div>
        <div class="search-select-box" v-if="showSelectBox">
          <div class="select-option" @click="setSearchSelect('baidu')">百度</div>
          <div class="select-option" @click="setSearchSelect('google')">谷歌</div>
          <div class="select-option" @click="setSearchSelect('bing')">必应</div>
        </div>
      </div>
      <input
        id="search-input"
        @keyup.enter="search()"
        v-model="searchUsed.value"
        class="search-input"
        type="text"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SearchBox extends Vue {
  // @Prop() private msg!: string;
  private showSelectBox = false;
  private searchUsed = {
    type: "baidu",
    name: "百度",
    value: ""
  };

  private allSearches = [
    { type: "baidu", name: "百度" },
    { type: "google", name: "谷歌" },
    { type: "bing", name: "必应" }
  ];

  mounted() {
    this.$nextTick(function() {
      document.addEventListener("click", e => {
        this.showSelectBox = false;
      });
    });
  }
  // 销毁document的点击事件
  beforeDestroy() {
    document.removeEventListener("click", e => {
      this.showSelectBox = false;
    });
  }

  private setSearchSelect(typeName: string) {
    const thisSearch = this.allSearches.find(a => a.type === typeName);
    if (thisSearch) {
      this.searchUsed.type = thisSearch.type;
      this.searchUsed.name = thisSearch.name;
    }
  }

  private search() {
    window.console.log("search");
    const value = this.searchUsed.value;
    window.console.log(value);
    switch (this.searchUsed.type) {
      case "baidu":
        this.searchBaidu(value);
        break;
      case "google":
        this.searchGoogle(value);
        break;
      case "bing":
        this.searchBing(value);
        break;
      default:
        break;
    }
  }
  private searchBaidu(value: string) {
    window.open(`https://www.baidu.com/s?wd=${value}`, "_blank");
  }
  private searchGoogle(value: string) {
    window.open(`https://www.google.com/search?q=${value}`, "_blank");
  }
  private searchBing(value: string) {
    window.open(`https://www.bing.com/search?q=${value}`, "_blank");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" src="./SearchBox.scss"></style>
