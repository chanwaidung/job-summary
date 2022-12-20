<template>
  <main class="home-index">
    <section class="entry-item" @click="$router.push({ name: 'Draw' })">
      抽取卡片
    </section>
  </main>
</template>

<script>
export default {
name: "index"
}
</script>

<style scoped>
.home-index {
  padding: 24px 24px;
}
.home-index .entry-item {
  padding: 15px 12px;
  box-shadow: 0 0 4px 4px #00000005;
  border-radius: 20px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>
