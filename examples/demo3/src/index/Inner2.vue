<template>
    <div :class="type[0] === 'x' ? 'inner2-x' : 'inner2-y'">
        <div :id="type + 'block1'" class="block block1"></div>
        <div :id="type + 'block2'" class="block block2"></div>
        <div :id="type + 'block3'" class="block block3"></div>
        <div :id="type + 'block4'" class="block block4"></div>
        <div :id="type + 'block5'" class="block block5"></div>
    </div>
</template>

<script>
export default {
    name: 'Inner2',
    props: ['type'],
}
</script>

<style>
.inner2-x {
    display: flex;
}
.block {
  width: 100%;
  height: 50px;
}
.inner2-x .block {
    flex: 0 0 125px;
    width: 125px;
    height: 125px;
}
.block1 {
    background: #dff0d8;
}
.block2 {
    background: #f5f5f5;
}
.block3 {
    background: #d9edf7;
}
.block4 {
    background: #fcf8e3;
}
.block5 {
    background: #f2dede;
}
</style>
