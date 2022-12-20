<template>
  <main class="draw-index">
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
    <flip-card></flip-card>
  </main>
</template>

<script>
import FlipCard from "@/views/draw/components/FlipCard";
export default {
  name: "draw",
  components: {FlipCard},
}
</script>

<style scoped>
.draw-index {
  display: grid;
  grid-template-rows: repeat(3, 192px);
  grid-template-columns: repeat(3, 95px);
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  width: calc(100vw - 80px);
  height: calc(100vh - 80px);
  margin: 20px 20px;
  padding: 20px 20px;
  border-radius: 20px;
  box-shadow: 0 0 4px 4px #00000020;
}
</style>
