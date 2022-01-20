<template>
  <div class="cnt">
    <p>I am normal</p>
    <p>route: {{route}}</p>
  </div>
</template>

<script>
export default {
  name: 'Normal',
  computed: {
    route() {
      return this.$route.path
    }
  }
}
</script>

<style>
.cnt {
  width: 100%;
  text-align: center;
}
</style>
