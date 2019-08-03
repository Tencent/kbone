<template>
    <div>
        <div class="controls" @click="onVideoControlsClick">
            <div>
                img1:
                <img class="video-img" src="https://i.loli.net/2019/07/27/5d3c141367f2784840.jpg"/>
            </div>
            <div>
                img2:
                <img class="video-img" src="https://i.loli.net/2019/07/27/5d3c143497e6d38917.jpg"/>
            </div>
            <div>this is video</div>
        </div>
        <div class="btn-cnt">
            <wx-component class="video-btn" behavior="button" open-type="share">分享</wx-component>
        </div>
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
.controls {
  display: flex;
  width: 100%;
  height: 60px;
  background: #ddd;
  align-items: center;
}

.controls .video-img {
  width: 40px;
  height: 40px;
}

.btn-cnt {
  position: relative;
  width: 100%;
}

.btn-cnt .video-btn {
  margin: 10px auto;
  width: 100px;
  height: 30px;
  color: #fff;
  background: #07c160;
  text-align: center;
  line-height: 30px;
  border-radius: 10px;
}
</style>
