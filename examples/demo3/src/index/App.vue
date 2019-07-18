<template>
  <div class="cnt">
    <wx-component behavior="picker" mode="region" @change="onPickerChange">选择城市</wx-component>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {
    onPickerChange(evt) {
      console.log(evt.detail)
    },
  }
}
</script>

<style>
.cnt {
  margin-top: 20px;
}
</style>
