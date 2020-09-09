<template>
    <div slot="callout">
        <wx-cover-view class="custom-callout" marker-id="2">
            <img class="callout-icon" src="./imgs/voice.png" /><div class="callout-content">callout 1</div>
        </wx-cover-view>
        <wx-cover-view class="custom-callout" marker-id="3">
            <img class="callout-icon" src="./imgs/voice.png" /><div class="callout-content">callout 2</div>
        </wx-cover-view>
    </div>
</template>

<script>
export default {
    name: 'Inner',
    methods: {
        onVideoControlsClick(evt) {
            console.log('onVideoControlsClick')
        },
    }
}
</script>

<style>
.callout-icon {
  width: 16px;
  height: 16px;
}

.callout-content {
  flex: 0 1 auto;
  margin: 0 10px;
  font-size: 14px;
}

.custom-callout {
  box-sizing: border-box;
  background-color: #fff; 
  border: 1px solid #ccc;
  border-radius: 30px;
  width: 150px;
  height: 40px;
  display: inline-flex;
  padding: 5px 20px;
  justify-content: center;
  align-items: center;
}
</style>
