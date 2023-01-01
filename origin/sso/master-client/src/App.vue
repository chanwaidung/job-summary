<template>
  <main class="sso-client">
    <section class="sso-client__content">
      <h2>Data List</h2>
      <template v-for="(item, key) in dataList" :key="key">
        <section class="data-item">{{ item }}</section>
      </template>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {getAccessToken, getData} from "./api/sign"
import { useRoute } from 'vue-router'
import router from "./router";
import {ACCESS_TOKEN_DEFAULT_KEY} from "./constants/base";

const dataList = ref(['......','......','......'])

const route = useRoute()

const getDataList = async ()=> {
  const { list } = await getData()
  dataList.value = list
  return Promise.resolve()
}

const exchangeIt = async ()=> {
  const { authCode } = route.query
  if(!authCode) return Promise.resolve()
  const { accessToken } = await getAccessToken({ authCode })
  console.log(accessToken)
  localStorage.setItem(ACCESS_TOKEN_DEFAULT_KEY, accessToken)
  return Promise.resolve()
}

onMounted(async()=> {
  await exchangeIt()
  await getDataList()
})
</script>

<style lang="scss" scoped>
.sso-client {
  width: 400px;
  &__content {
    width: 100%;
    height: 100%;
    background-color: white;
    box-shadow: 0 0 4px 4px #00000008;
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
    .data-item {
      margin-bottom: 16px;
      padding: 10px 10px;
      box-shadow: 0 0 4px 4px #00000005;
      border-radius: 20px;
    }
  }
}
</style>
