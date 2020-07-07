<template>
  <draggable
    class="mark-box"
    :list="allMarks"
    group="allMarksGroup"
    handle=".mark-con-title"
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
          <div class="mark-add" @click="showItemDialog(index, -1)">
            <img src="static/img/add.svg" alt="" />
          </div>
          <div class="mark-edit" @click="showGroupDialog(index)">
            <img src="static/img/edit.svg" alt="" />
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
            <!-- <div class="color" v-if="!isShowIcon || !item.icon">
              <i class="color-dot"></i>
            </div> -->
            <a :href="item.url" target="_blank">
              <img :src="item.icon" :onerror="defaultImg" />
              <span>{{ item.name }}</span>
            </a>
            <div
              class="mark-item-edit"
              @click="showItemDialog(index, subIndex)"
            >
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
        <h1>{{ groupHeader }}</h1>
        <input v-model="groupTitle" type="text" placeholder="标题" />
        <input type="text" placeholder="标题" style="opacity: 0" />
        <div class="button-content">
          <button class="btn-cancel" @click="hideGroupDialog()">
            取 消
          </button>
          <button class="btn-del" @click="delGroup()">
            <img src="static/img/del.svg" alt="" />
          </button>
          <button @click="addGroup()">
            确 定
          </button>
          <div class="message" v-if="groupMsg">{{ groupMsg }}</div>
        </div>
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
        <h1>{{ itemHeader }}</h1>
        <input v-model="itemTitle" type="text" placeholder="标题" />
        <input v-model="itemUrl" type="text" placeholder="网址" />
        <div class="button-content">
          <button class="btn-cancel" @click="hideItemDialog()">
            取 消
          </button>
          <button class="btn-del" @click="delItem()">
            <img src="static/img/del.svg" alt="" />
          </button>
          <button @click="addItem()">
            确 定
          </button>
        </div>
        <div class="message" v-if="itemMsg">{{ itemMsg }}</div>
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
  private groupHeader = '添加分组'
  private itemHeader = '添加网站'
  private groupMsg = ''
  private itemMsg = ''
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
  private allMarks: Mark[] = []
  private defaultImg = 'this.src="' + require('../../assets/empty.svg') + '"'

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
    this.itemMsg = ''
    if (index > -1) {
      this.selectedListIndex = index
      this.selectedItemIndex = subIndex
      this.isShowItemDialog = true
      if (subIndex > -1) {
        this.itemHeader = '编辑网站'
        this.itemTitle = this.allMarks[index].items[subIndex].name
        this.itemUrl = this.allMarks[index].items[subIndex].url
      } else {
        this.itemHeader = '添加网站'
        this.itemTitle = ''
        this.itemUrl = ''
      }
    }
  }
  hideItemDialog() {
    this.selectedListIndex = -1
    this.selectedItemIndex = -1
    this.isShowItemDialog = false
  }

  showGroupDialog(index?: number) {
    this.groupMsg = ''
    if (index) {
      this.groupTitle = this.allMarks[index].title
      this.selectedListIndex = index
      this.groupHeader = '编辑分组'
    } else {
      this.groupHeader = '添加分组'
      this.groupTitle = ''
      this.selectedListIndex = -1
    }
    this.isShowGroupDialog = true
  }
  hideGroupDialog() {
    this.selectedListIndex = -1
    this.isShowGroupDialog = false
  }

  addGroup() {
    if (!this.groupTitle) {
      return false
    }
    if (this.selectedListIndex > -1) {
      this.allMarks[this.selectedListIndex].title = this.groupTitle
    } else {
      this.allMarks.push({
        title: this.groupTitle,
        items: []
      })
    }
    this.saveMark()
    this.hideGroupDialog()
  }

  delGroup() {
    if (this.selectedListIndex > -1) {
      this.allMarks.splice(this.selectedListIndex, 1)
      this.saveMark()
      this.hideGroupDialog()
    }
  }

  addItem() {
    if (!this.itemTitle || !this.itemUrl) {
      this.itemMsg = '请填写标题'
      return false
    }
    if (!this.itemUrl) {
      this.itemMsg = '请填写网址'
      return false
    }
    if (!this.IsURL(this.itemUrl)) {
      this.itemMsg = '请检查网址'
      return false
    }
    const thisItem = this.allMarks[this.selectedListIndex].items[
      this.selectedItemIndex
    ]
    if (thisItem && this.selectedItemIndex > -1) {
      this.allMarks[this.selectedListIndex].items[
        this.selectedItemIndex
      ].name = this.itemTitle
      this.allMarks[this.selectedListIndex].items[
        this.selectedItemIndex
      ].url = this.itemUrl
    } else {
      const domain = this.itemUrl.split('/') //以“/”进行分割
      let iconUrl = ''
      if (domain[2] && domain[0] && domain[0].startsWith('http')) {
        iconUrl = domain[0] + '//' + domain[2] + '/favicon.ico'
      } else {
        iconUrl = '' //如果url不正确就取空
      }
      this.allMarks[this.selectedListIndex].items.push({
        color: 0,
        name: this.itemTitle,
        icon: iconUrl,
        url: this.itemUrl
      })
    }
    this.saveMark()
    this.hideItemDialog()
  }

  delItem() {
    if (this.selectedListIndex > -1 && this.selectedItemIndex > -1) {
      this.allMarks[this.selectedListIndex].items.splice(
        this.selectedItemIndex,
        1
      )
      this.saveMark()
      this.hideItemDialog()
    }
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
              // console.log('服务器保存成功')
              localStorage.setItem('mark', JSON.stringify(this.allMarks))
            }
          },
          error => {
            console.log(error)
          }
        )
    } else {
      // console.log('未连接服务器')
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

  IsURL(url: string) {
    // eslint-disable-next-line no-useless-escape
    const reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
    if (!reg.test(url)) {
      return false
      // alert('这网址不是以http://https://开头，或者不是网址！')
    } else {
      return true
      // alert('输入成功')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" src="./MarkBox.scss"></style>
