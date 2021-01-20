<template>
  <div class="cnt">
    <h2>kbone</h2>
    <comp-e class="block" my-class="external-red">
      <div>comp-e slot</div>
    </comp-e>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
.cnt {
  margin: 15px;
}

.block {
  border: 1px solid #ddd;
  padding: 15px;
  box-sizing: content-box;
  display: block;
  margin-bottom: 15px;
}

.external-red {
  color: red;
}
</style>
