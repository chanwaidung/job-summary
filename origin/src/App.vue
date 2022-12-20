<template>
  <main class="origin-app">
    <router-view></router-view>
  </main>
</template>

<script>
export default {
  name: 'App',
  components: {}
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
.origin-app {
  width: 100vw;
  min-height: 100vh;
  max-width: 700px;
  background-color: #ffffff;
}
</style>
