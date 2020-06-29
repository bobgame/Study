<template>
  <draggable
    class="mark-box"
    :list="allMarks"
    group="allMarksGroup"
    draggable=".mark-con"
    @change="handleChange"
  >
    <div
      v-for="(mark, index) in allMarks"
      :key="'mark-con-' + index"
      class="mark-con"
    >
      <div class="mark-card">
        <div class="mark-con-title">
          <span>{{ mark.title }}</span>
          <div
            class="mark-add"
            @click="showItemDialog(index, mark.items.length)"
          >
            <img src="static/img/add.svg" alt="" />
          </div>
        </div>

        <draggable
          class="mark-list"
          :list="mark.items"
          draggable=".mark-item"
          group="markGroup"
          @change="handleChange2"
        >
          <div
            class="mark-item"
            v-for="(item, subIndex) in mark.items"
            :key="'mark-list-' + index + '-' + subIndex"
          >
            <div class="color" v-if="!isShowIcon || !item.icon">
              <i class="color-dot"></i>
            </div>
            <a :href="item.url" target="_blank">
              <img
                :src="item.icon"
                v-if="isShowIcon && item.icon"
                :onerror="defaultImg"
              />
              <span>{{ item.name }}</span>
            </a>
            <div class="mark-edit" @click="showItemDialog(index, subIndex)">
              <img src="static/img/edit.svg" alt="" />
            </div>
          </div>
        </draggable>
      </div>
    </div>
    <div class="mark-con-add" @click="showGroupDialog()">
      <div class="mark-list-add">
        <img src="static/img/add.svg" alt="" />
      </div>
    </div>
    <div class="mark-con-empty"></div>
    <div class="mark-con-empty"></div>
    <div class="mark-con-empty"></div>
    <div class="mark-con-empty"></div>
    <div
      class="add-dialog add-group-dialog"
      role="dialog"
      tabindex="-1"
      v-if="isShowGroupDialog"
    >
      <div class="add-mask" @click="hideGroupDialog()"></div>
      <div class="add-content">
        <h1>添加分组</h1>
        <input v-model="groupTitle" type="text" placeholder="标题" />
        <input type="text" placeholder="标题" style="opacity: 0" />
        <button class="btn-cancel" @click="hideGroupDialog()">
          取 消
        </button>
        <button @click="addGroup()">
          确 定
        </button>
      </div>
    </div>
    <div
      class="add-dialog add-item-dialog"
      role="dialog"
      tabindex="-1"
      v-if="isShowItemDialog"
    >
      <div class="add-mask" @click="hideItemDialog()"></div>
      <div class="add-content">
        <h1>添加网站</h1>
        <input v-model="itemTitle" type="text" placeholder="标题" />
        <input v-model="itemUrl" type="text" placeholder="网址" />
        <button class="btn-cancel" @click="hideItemDialog()">
          取 消
        </button>
        <button @click="addItem()">
          确 定
        </button>
      </div>
    </div>
  </draggable>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Mark } from '@/interface/mark.interface'
import { APPUSE } from '../../app-config'
import store from '../../store'
import draggable from 'vuedraggable'

@Component({
  components: {
    draggable
  }
})
export default class MarkBox extends Vue {
  // @Prop() private msg!: string;
  private isShowGroupDialog = false
  private groupTitle = ''
  private itemTitle = ''
  private itemUrl = ''
  private isShowItemDialog = false
  private selectedListIndex = -1
  private selectedItemIndex = -1
  private isShowIcon = false
  private isLoadServer = false
  private get name() {
    return store.state.name
  }
  private showSelectBox = false
  private searchUsed = {
    type: 'baidu',
    name: '百度',
    value: ''
  }
  private allMarks: Mark[] = []
  private defaultImg = 'this.src="' + require('../../assets/empty.svg') + '"'

  private allSearches = [
    { type: 'baidu', name: '百度' },
    { type: 'google', name: '谷歌' },
    { type: 'bing', name: '必应' }
  ]

  mounted() {
    const localIsShowIcon = localStorage.getItem('isShowIcon')
    if (localIsShowIcon) {
      this.isShowIcon = JSON.parse(localIsShowIcon)
    }
    const localMark = localStorage.getItem('mark')
    if (localMark) {
      this.allMarks = JSON.parse(localMark)
    }
    this.$http.post(APPUSE.host + '/users/getmark', { name: this.name }).then(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (res: any) => {
        this.isShowIcon = res.body.isShowIcon
        this.allMarks = res.body.mark
        this.isLoadServer = true
        localStorage.setItem('isShowIcon', JSON.stringify(res.body.isShowIcon))
        localStorage.setItem('mark', JSON.stringify(res.body.mark))
      },
      error => {
        console.log(error)
      }
    )
    // this.$http.get("/static/data/mark.json").then(
    //   (res: any) => {
    //     this.allMarks = res.body.mark
    //   },
    //   error => {
    //     this.allMarks = MockMark
    //   }
    // )
  }
  // 销毁document的点击事件
  beforeDestroy() {
    // document.removeEventListener("click", e => {
    //   this.showSelectBox = false;
    // });
  }

  showItemDialog(index: number, subIndex: number) {
    if (index > -1) {
      this.selectedListIndex = index
      this.selectedItemIndex = subIndex
      this.isShowItemDialog = true
    }
  }
  hideItemDialog() {
    this.selectedListIndex = -1
    this.selectedItemIndex = -1
    this.isShowItemDialog = false
  }

  showGroupDialog() {
    this.isShowGroupDialog = true
  }
  hideGroupDialog() {
    this.isShowGroupDialog = false
  }

  addGroup() {
    if (!this.groupTitle) {
      return false
    }
    this.allMarks.push({
      title: this.groupTitle,
      items: []
    })
    this.saveMark()
    this.hideGroupDialog()
  }

  addItem() {
    if (!this.itemTitle || !this.itemUrl) {
      return false
    }
    const thisItem = this.allMarks[this.selectedListIndex][
      this.selectedItemIndex
    ]
    if (thisItem) {
      this.allMarks[this.selectedListIndex][
        this.selectedItemIndex
      ].name = this.itemTitle
      this.allMarks[this.selectedListIndex][
        this.selectedItemIndex
      ].url = this.itemUrl
    } else {
      this.allMarks[this.selectedListIndex].items.push({
        color: 0,
        name: this.itemTitle,
        icon: '',
        url: this.itemUrl
      })
    }
    this.saveMark()
    this.hideItemDialog()
  }

  handleChange() {
    // window.console.log(evt)
    this.saveMark()
  }
  handleChange2() {
    // window.console.log(evt)
    this.saveMark()
  }

  private saveMark() {
    if (this.isLoadServer) {
      this.$http
        .post(APPUSE.host + '/users/savemark', {
          name: this.name,
          isShowIcon: this.isShowIcon,
          mark: this.allMarks
        })
        .then(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (res: any) => {
            if (res && res.data && res.data.isOK) {
              console.log('服务器保存成功')
              localStorage.setItem('mark', JSON.stringify(this.allMarks))
            }
          },
          error => {
            console.log(error)
          }
        )
    } else {
      console.log('未连接服务器')
    }
  }

  Unicode2Native(value: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const code: any = value.match(/&#(\d+);/g)
    let str = ''
    if (code) {
      for (let i = 0; i < code.length; i++) {
        str += String.fromCharCode(code[i].replace(/[&#;]/g, ''))
      }
    }
    return str
  }

  Native2Unicode(value: string): string {
    let str = ''
    for (let i = 0; i < value.length; i++) {
      str += '&#' + value.charCodeAt(i)
    }
    return str
  }

  private setSearchSelect(typeName: string) {
    const thisSearch = this.allSearches.find(a => a.type === typeName)
    if (thisSearch) {
      this.searchUsed.type = thisSearch.type
      this.searchUsed.name = thisSearch.name
    }
  }

  private search() {
    window.console.log('search')
    const value = this.searchUsed.value
    window.console.log(value)
    switch (this.searchUsed.type) {
      case 'baidu':
        this.searchBaidu(value)
        break
      case 'google':
        this.searchGoogle(value)
        break
      case 'bing':
        this.searchBing(value)
        break
      default:
        break
    }
  }
  private searchBaidu(value: string) {
    window.open(`https://www.baidu.com/s?wd=${value}`, '_blank')
  }
  private searchGoogle(value: string) {
    window.open(`https://www.google.com/search?q=${value}`, '_blank')
  }
  private searchBing(value: string) {
    window.open(`https://www.bing.com/search?q=${value}`, '_blank')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" src="./MarkBox.scss"></style>
