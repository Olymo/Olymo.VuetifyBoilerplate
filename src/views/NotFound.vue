<template>
  <div class="centered">
    <h1 class="">Oops!</h1>
    <h3 class="">The page you're looking for is not here.</h3>
    <router-link :to="{ name: 'home' }" >Back to home or login page</router-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.centered {
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.link-color {
  color: white;
}
</style>
