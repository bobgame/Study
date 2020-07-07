<template>
  <div id="app-con">
    <div class="nav">
      <!-- 使用 router-link 组件来导航. -->
      <!-- 通过传入 `to` 属性指定链接. -->
      <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
      <span class="name" v-if="name">{{ name }}</span>
      <a class="login" v-if="name" @click="logout()">退出</a>
      <a class="login" v-if="!name" @click="toggleLogin()">登录</a>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <Login v-if="isShowLogin" />
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import store from './store/index'
import Login from '@/components/Login/Login.vue'
import { setIconTitle } from '@/units/setIconTitle'

@Component({
  components: {
    Login
  }
})
export default class App extends Vue {
  mounted() {
    if (this.getToken()) {
      if (
        this.getToken().length > 50 &&
        (this.getIsOk() == 'ok' || this.getIsOk() == 'yes') &&
        this.getName()
      ) {
        setIconTitle(this.getName()) // 动态修改网站图标和标题
        store.dispatch('setName', this.getName())
        store.dispatch('setOK', true)
      }
    }
  }

  get name() {
    return store.state.name
  }
  get isShowLogin() {
    return store.state.isShowLogin
  }
  get isOK() {
    return store.state.isOK
  }
  toggleLogin() {
    store.dispatch('toggleLogin', true)
  }

  getToken() {
    if (localStorage.token) {
      return localStorage.token
    } else {
      return null
    }
  }
  getIsOk() {
    if (localStorage.isOK) {
      return localStorage.isOK
    } else {
      return null
    }
  }
  getName() {
    if (localStorage.name) {
      return localStorage.name
    } else {
      return null
    }
  }
  logout() {
    store.dispatch('setName', '')
    store.dispatch('setOK', false)
    store.dispatch('toggleLogin', false)
    localStorage.removeItem('token')
    localStorage.removeItem('isOK')
    localStorage.removeItem('name')
  }
}
</script>

<style lang="scss" src="./App.scss"></style>
