<template>
  <main class="sso-client">
    <section class="sso-client__content">
      <h2>Sign In</h2>
      <button class="confirm-btn" @click="authing">一键授权登录</button>
    </section>
  </main>
</template>

<script setup>
import {signIn} from "./api/sign"
import { useRoute } from 'vue-router'

const route = useRoute()

const authing = async ()=> {
  const { redirect='/' } = route.query
  const { authCode } = await signIn()
  window.location.href = decodeURIComponent(`${redirect}?authCode=${authCode}`)
}
</script>

<style lang="scss" scoped>
.sso-client {
  width: 400px;
  &__content {
    width: 100%;
    height: 100%;
    background-color: white;
    box-shadow: 0 0 4px 4px #00000010;
    padding: 10px 20px 25px 20px;
    border-radius: 20px;
    color: #1a1a1a;
    .confirm-btn {
      color: #ffffff;
      outline: none;
      background-color: #0066ff;
      padding: 20px 20px;
      border-radius: 20px;
      width: 100%;
      font-weight: bold;
      font-size: 18px;
    }
  }
}
</style>
