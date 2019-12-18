<template>
  <div class="mark-box">
    <div v-for="(mark, index) in allMarks" :key="'mark-con-' + index" class="mark-con">
      <div class="mark-con-title">{{mark.title}}</div>
      <div class="mark-list">
        <a
          class="mark-item"
          v-for="(item, subIndex) in mark.items"
          :key="'mark-list-' + index + '-' + subIndex"
          :href="item.url"
          target="_blank"
        >
          <img :src="item.icon" :onerror="defaultImg" />
          <span>{{item.name}}</span>
        </a>
        <div class="mark-item-empty"></div>
        <div class="mark-item-empty"></div>
        <div class="mark-item-empty"></div>
      </div>
    </div>
    <div class="mark-con-empty"></div>
    <div class="mark-con-empty"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { Mark } from "@/interface/mark.interface"
import { MockMark } from "./mock-mark"

@Component
export default class MarkBox extends Vue {
  // @Prop() private msg!: string;
  private showSelectBox = false;
  private searchUsed = {
    type: "baidu",
    name: "百度",
    value: ""
  };
  private allMarks: Mark[] = [];
  private defaultImg = 'this.src="' + require("../../assets/empty.svg") + '"';

  private allSearches = [
    { type: "baidu", name: "百度" },
    { type: "google", name: "谷歌" },
    { type: "bing", name: "必应" }
  ];

  mounted() {
    this.$http
      .get("/static/data/mark.json")
      .then((res: any) => {
        this.allMarks = res.body.mark
      }, error => {
        this.allMarks = MockMark
      })
  }
  // 销毁document的点击事件
  beforeDestroy() {
    // document.removeEventListener("click", e => {
    //   this.showSelectBox = false;
    // });
  }

  private setSearchSelect(typeName: string) {
    const thisSearch = this.allSearches.find(a => a.type === typeName)
    if (thisSearch) {
      this.searchUsed.type = thisSearch.type
      this.searchUsed.name = thisSearch.name
    }
  }

  private search() {
    window.console.log("search")
    const value = this.searchUsed.value
    window.console.log(value)
    switch (this.searchUsed.type) {
      case "baidu":
        this.searchBaidu(value)
        break
      case "google":
        this.searchGoogle(value)
        break
      case "bing":
        this.searchBing(value)
        break
      default:
        break
    }
  }
  private searchBaidu(value: string) {
    window.open(`https://www.baidu.com/s?wd=${value}`, "_blank")
  }
  private searchGoogle(value: string) {
    window.open(`https://www.google.com/search?q=${value}`, "_blank")
  }
  private searchBing(value: string) {
    window.open(`https://www.bing.com/search?q=${value}`, "_blank")
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" src="./MarkBox.scss"></style>
