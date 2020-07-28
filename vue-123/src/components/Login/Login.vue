<template>
  <div class="login-box" role="dialog" tabindex="-1">
    <div class="login-mask"></div>
    <div class="login-content">
      <h1>登录</h1>
      <div class="input-content">
        <input v-model="username" type="text" name="username" required />
        <br />
        <input v-model="password" type="password" name="password" required />
        <button @click="login()">
          登 录
        </button>
        <div class="msg">{{ msg }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'
import { APPUSE } from '../../app-config'
import store from '../../store/index'
import { setIconTitle } from '@/units/setIconTitle'

@Component
export default class Login extends Vue {
  // @Prop() private msg!: string;
  private username = ''
  private password = ''
  private msg = ''

  mounted() {
    window.addEventListener('keyup', this.handleKeyup)
  }
  // 销毁document的点击事件
  beforeDestroy() {
    // window.removeEventListener('keyup',this.handleKeyup)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleKeyup(event: any) {
    const e = event || window.event || arguments.callee.caller.arguments[0]
    if (!e) return
    const { key } = e
    if (key === 'Enter' || key === 'enter') {
      this.login()
    }
  }
  setToken(token: string, isOK: string, name: string) {
    localStorage.removeItem('token')
    localStorage.removeItem('isOK')
    localStorage.removeItem('name')
    if ((token as string).length != 0) {
      localStorage.token = token
      localStorage.isOK = isOK
      localStorage.name = name
    }
  }

  login() {
    axios({
      url: APPUSE.host + '/users/login',
      method: 'post',
      auth: {
        username: this.username,
        password: this.password
      },
      data: {
        // need: 'money'
      }
    })
      .then(response => {
        this.setToken(
          response.data['token'],
          response.data['qx'],
          this.username
        )
        setIconTitle(this.username)
        store.dispatch('setName', this.username)
        store.dispatch('setOK', true)
        store.dispatch('toggleLogin', false)
        // console.log('登录成功！')

        store.dispatch('toggleLogin')
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" src="./Login.scss"></style>
