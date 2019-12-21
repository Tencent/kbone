<template>
  <div class="cnt">
    <p>I am bbb, {{$t("hello")}}</p>
    <p>route: {{route}}</p>
  </div>
</template>

<script>
export default {
  name: 'BBB',
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
