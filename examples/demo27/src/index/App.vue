<template>
  <div v-if="show" class="cnt">
    <wx-view class="item">
      <div class="title">wx-movable-area/wx-movable-view</div>
      <div class="comp-cnt wx-movable-cnt">
        <wx-movable-area class="wx-movable-area">
          <wx-movable-view
            ref="wx-movable-view"
            class="wx-movable-view"
            :inertia="wxMovableView.inertia"
            :out-of-bounds="wxMovableView.outOfBounds"
            :disabled="wxMovableView.disabled"
            :animation="wxMovableView.animation"
            :scale-area="wxMovableView.scaleArea"
            :damping="wxMovableView.damping"
            :friction="wxMovableView.friction"
            :scale="wxMovableView.scale"
            :scale-min="wxMovableView.scaleMin"
            :scale-max="wxMovableView.scaleMax"
            direction="all"
            @change="log('[wx-movable-view change]', $event.detail)"
            @scale="log('[wx-movable-view scale]', $event.detail)"
            @htouchmove="log('[wx-movable-view htouchmove]', $event)"
            @vtouchmove="log('[wx-movable-view vtouchmove]', $event)"
          >text</wx-movable-view>
          <wx-movable-view
            v-for="item in wxMovableView.count"
            :key="item"
            :inertia="true"
            :out-of-bounds="true"
            :animation="true"
            direction="all"
            class="wx-movable-view"
            @change="log('[wx-movable-view change]', $event.detail)"
            @scale="log('[wx-movable-view scale]', $event.detail)"
            @htouchmove="log('[wx-movable-view htouchmove]', $event)"
            @vtouchmove="log('[wx-movable-view vtouchmove]', $event)"
          >text</wx-movable-view>
          <template v-if="wxMovableView.addDirection">
            <wx-movable-view
              :inertia="true"
              :out-of-bounds="true"
              :animation="true"
              direction="all"
              class="wx-movable-view"
              @change="log('[wx-movable-view all change]', $event.detail)"
              @htouchmove="log('[wx-movable-view all htouchmove]', $event)"
              @vtouchmove="log('[wx-movable-view all vtouchmove]', $event)"
            >all</wx-movable-view>
            <wx-movable-view
              x="250"
              :inertia="true"
              :out-of-bounds="true"
              :animation="true"
              direction="vertical"
              class="wx-movable-view"
              @change="log('[wx-movable-view vertical change]', $event.detail)"
              @htouchmove="log('[wx-movable-view vertical htouchmove]', $event)"
              @vtouchmove="log('[wx-movable-view vertical vtouchmove]', $event)"
            >v</wx-movable-view>
            <wx-movable-view
              y="250"
              :inertia="true"
              :out-of-bounds="true"
              :animation="true"
              direction="horizontal"
              class="wx-movable-view"
              @change="log('[wx-movable-view horizontal change]', $event.detail)"
              @htouchmove="log('[wx-movable-view horizontal htouchmove]', $event)"
              @vtouchmove="log('[wx-movable-view horizontal vtouchmove]', $event)"
            >h</wx-movable-view>
            <wx-movable-view
              x="250"
              y="250"
              :inertia="true"
              :out-of-bounds="true"
              :animation="true"
              direction="none"
              class="wx-movable-view"
              @change="log('[wx-movable-view none change]', $event.detail)"
              @htouchmove="log('[wx-movable-view none htouchmove]', $event)"
              @vtouchmove="log('[wx-movable-view none vtouchmove]', $event)"
            >none</wx-movable-view>
          </template>
        </wx-movable-area>
        <div class="opr-cnt">
          <wx-button class="wx-button opr-button move-1" @click="moveWxMovableView()">移动（随机）</wx-button>
          <wx-button class="wx-button opr-button move-2" @click="moveWxMovableView(wxMovableView.x - 100, wxMovableView.y - 100)">移动（-100, -100）</wx-button>
          <wx-button class="wx-button opr-button move-3" @click="moveWxMovableView(wxMovableView.x + 100, wxMovableView.y + 100)">移动（+100, +100）</wx-button>
          <wx-button class="wx-button opr-button move-4" @click="moveWxMovableView(0, 0)">移动（0, 0）</wx-button>
          <wx-button class="wx-button opr-button scale-1" @click="scaleWxMovableView()">放缩（随机）</wx-button>
          <wx-button class="wx-button opr-button scale-2" @click="scaleWxMovableView(wxMovableView.scaleValue * 0.8)">放缩（0.8）</wx-button>
          <wx-button class="wx-button opr-button scale-3" @click="scaleWxMovableView(wxMovableView.scaleValue * 1.2)">放缩（1.2）</wx-button>
          <wx-button class="wx-button opr-button scale-4" @click="scaleWxMovableView(1)">放缩（1）</wx-button>
          <wx-button class="wx-button opr-button add-view" @click="wxMovableView.count++">增加滑块</wx-button>
          <wx-button class="wx-button opr-button reduce-view" @click="wxMovableView.count = Math.max(wxMovableView.count - 1, 0)">删除滑块</wx-button>
          <wx-button class="wx-button opr-button clear-view" @click="wxMovableView.count = 0">清空滑块</wx-button>
          <wx-button class="wx-button opr-button add-view" @click="wxMovableView.addDirection = true">增加四个不同方向滑块</wx-button>
          <wx-button class="wx-button opr-button add-view" @click="wxMovableView.addDirection = false">删除四个不同方向滑块</wx-button>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">惯性</div>
          <wx-switch :checked="true" @change="wxMovableView.inertia = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">允许超过可移动区域</div>
          <wx-switch :checked="true" @change="wxMovableView.outOfBounds = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">禁用</div>
          <wx-switch @change="wxMovableView.disabled = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">动画</div>
          <wx-switch :checked="true" @change="wxMovableView.animation = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">放缩区域为整个 area</div>
          <wx-switch @change="wxMovableView.scaleArea = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">阻尼系数</div>
          <div class="opr-box">
            <wx-slider min="1" max="100" step="2" value="20" :show-value="true" @change="wxMovableView.damping = $event.detail.value"></wx-slider>
          </div>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">摩擦系数</div>
          <div class="opr-box">
            <wx-slider min="1" max="10" step="1" value="2" :show-value="true" @change="wxMovableView.friction = $event.detail.value"></wx-slider>
          </div>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">放缩</div>
          <wx-switch :checked="true" @change="wxMovableView.scale = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">放缩最小值</div>
          <div class="opr-box">
            <wx-slider min="0.5" max="1" step="0.1" value="0.5" :show-value="true" @change="wxMovableView.scaleMin = $event.detail.value"></wx-slider>
          </div>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">放缩最大值</div>
          <div class="opr-box">
            <wx-slider min="1" max="10" step="1" value="10" :show-value="true" @change="wxMovableView.scaleMax = $event.detail.value"></wx-slider>
          </div>
        </div>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-scroll-view</div>
      <div class="comp-cnt wx-scroll-view-cnt">
        <wx-scroll-view
          ref="wx-scroll-view-y"
          class="wx-scroll-view-y"
          :scroll-y="true"
          :scroll-with-animation="wxScrollView.y.scrollWithAnimation"
          :refresher-enabled="wxScrollView.y.refresherEnabled"
          :refresher-default-style="wxScrollView.y.refresherCustom ? 'none' : 'black'"
          @scroll="log('[wx-scroll-view scroll]', $event.detail)"
          @scrolltoupper="log('[wx-scroll-view scrolltoupper]', $event.detail)"
          @scrolltolower="log('[wx-scroll-view scrolltolower]', $event.detail)"
          @refresherpulling="onScrollViewYRefresherPulling"
          @refresherrefresh="onScrollViewYRefresherRefresh"
          @refresherrestore="log('[wx-scroll-view refresherrestore]', $event.detail)"
          @refresherabort="log('[wx-scroll-view refresherabort]', $event.detail)"
        >
          <div class="inner2-y">
            <div id="yblock1" class="block block1"></div>
            <div id="yblock2" class="block block2"></div>
            <div id="yblock3" class="block block3"></div>
            <div id="yblock4" class="block block4"></div>
            <div id="yblock5" class="block block5"></div>
          </div>
          <div v-if="wxScrollView.y.refresherCustom" slot="refresher" ref="refresh-container" class="refresh-container">
            <div class="refresh-container-text">下拉刷新</div>
          </div>
        </wx-scroll-view>
        <div class="opr-cnt opr-cnt-y">
          <wx-button class="wx-button opr-button" @click="setAttribute('wx-scroll-view-y', 'scroll-into-view', 'yblock3')">滑动到第三个</wx-button>
          <wx-button class="wx-button opr-button" @click="setAttribute('wx-scroll-view-y', 'scroll-top', 120)">滚动到 120px 处</wx-button>
          <wx-button class="wx-button opr-button" @click="setAttribute('wx-scroll-view-y', 'refresher-triggered', true)">触发下拉</wx-button>
        </div>
        <div class="opr-cnt opr-cnt-y">
          <div class="opr-label">动画</div>
          <wx-switch :checked="true" @change="wxScrollView.y.scrollWithAnimation = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt opr-cnt-y">
          <div class="opr-label">下拉刷新</div>
          <wx-switch @change="wxScrollView.y.refresherEnabled = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt opr-cnt-y">
          <div class="opr-label">自定义下拉刷新</div>
          <wx-switch @change="wxScrollView.y.refresherCustom = $event.detail.value.toString()"></wx-switch>
        </div>
        <wx-scroll-view
          ref="wx-scroll-view-x"
          class="wx-scroll-view-x"
          :scroll-x="true"
          :scroll-with-animation="wxScrollView.x.scrollWithAnimation"
          @scroll="wxScrollView.x.scrollIntoView = ''; wxScrollView.x.scrollLeft = $event.detail.scrollLeft; log('[wx-scroll-view scroll]', $event.detail)"
          @scrolltoupper="log('[wx-scroll-view scrolltoupper]', $event.detail)"
          @scrolltolower="log('[wx-scroll-view scrolltolower]', $event.detail)"
        >
          <div class="inner2-x">
            <div id="xblock1" class="block block1"></div>
            <div id="xblock2" class="block block2"></div>
            <div id="xblock3" class="block block3"></div>
            <div id="xblock4" class="block block4"></div>
            <div id="xblock5" class="block block5"></div>
          </div>
        </wx-scroll-view>
        <div class="opr-cnt">
          <wx-button class="wx-button opr-button" @click="setAttribute('wx-scroll-view-x', 'scroll-into-view', 'xblock3')">滑动到第二个</wx-button>
          <wx-button class="wx-button opr-button" @click="setAttribute('wx-scroll-view-x', 'scroll-left', 120)">滚动到 120px 处</wx-button>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">动画</div>
          <wx-switch :checked="true" @change="wxScrollView.x.scrollWithAnimation = $event.detail.value.toString()"></wx-switch>
        </div>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-swiper/wx-swiper-item</div>
      <div class="comp-cnt wx-swiper-cnt">
        <wx-swiper
          ref="wx-swiper"
          class="wx-swiper"
          :indicator-dots="wxSwiper.indicatorDots"
          :autoplay="wxSwiper.autoplay"
          :circular="wxSwiper.circular"
          :vertical="wxSwiper.vertical"
          :previous-margin="wxSwiper.margin === 'true' ? '20px' : ''"
          :next-margin="wxSwiper.margin === 'true' ? '20px' : ''"
          :snap-to-edge="wxSwiper.snapToEdge"
          :skip-hidden-item-layout="wxSwiper.skipHiddenItemLayout"
          :kbone-enable-wheel="wxSwiper.kboneEnableWheel"
          :indicator-color="wxSwiper.indicatorColor === 'true' ? 'white' : ''"
          :indicator-active-color="wxSwiper.indicatorColor === 'true' ? 'red' : ''"
          :interval="wxSwiper.interval"
          :duration="wxSwiper.duration"
          :display-multiple-items="wxSwiper.displayMultipleItems"
          :easing-function="wxSwiper.easingFunction"
          @change="log('[wx-swiper change]', $event.detail)"
          @transition="log('[wx-swiper transition]', $event.detail)"
          @animationfinish="log('[wx-swiper animationfinish]', $event.detail)"
        >
          <wx-swiper-item v-for="item in wxSwiper.totalItems" :key="item">
            <div :class="`wx-swiper-item-view wx-swiper-item-view-${item}`">{{wxSwiper.charString[item - 1]}}</div>
          </wx-swiper-item>
        </wx-swiper>
        <div class="opr-cnt">
          <div class="opr-label">指示点</div>
          <wx-switch :checked="true" @change="wxSwiper.indicatorDots = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">自动播放</div>
          <wx-switch @change="wxSwiper.autoplay = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">循环播放</div>
          <wx-switch @change="wxSwiper.circular = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">纵向</div>
          <wx-switch @change="wxSwiper.vertical = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">设置边距</div>
          <wx-switch @change="wxSwiper.margin = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">snap-to-edge</div>
          <wx-switch @change="wxSwiper.snapToEdge = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">隐藏不显示的滑块</div>
          <wx-switch :checked="true" @change="wxSwiper.skipHiddenItemLayout = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">开启 wheel 事件（kbone-ui 特有）</div>
          <wx-switch :checked="true" @change="wxSwiper.kboneEnableWheel = $event.detail.value.toString()"></wx-switch>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">指示点（默认）</div>
          <wx-switch @change="wxSwiper.indicatorColor = $event.detail.value.toString()"></wx-switch>
          <div class="opr-label">指示点（红）</div>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">时间间隔</div>
          <div class="opr-box">
            <wx-slider min="1000" max="5000" step="500" value="3000" :show-value="true" @change="wxSwiper.interval = $event.detail.value"></wx-slider>
          </div>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">滑动时长</div>
          <div class="opr-box">
            <wx-slider min="100" max="1000" step="100" value="500" :show-value="true" @change="wxSwiper.duration = $event.detail.value"></wx-slider>
          </div>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">总滑块数量</div>
          <div class="opr-box">
            <wx-slider min="1" max="6" step="1" :value="wxSwiper.totalItems" :show-value="true" @change="wxSwiper.totalItems = $event.detail.value"></wx-slider>
          </div>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">展示滑块数量</div>
          <div class="opr-box">
            <wx-slider min="1" max="3" step="1" value="1" :show-value="true" @change="onUpdateWxSwiperShowItems"></wx-slider>
          </div>
        </div>
        <div class="opr-cnt">
            <wx-button class="wx-button opr-button" @click="setAttribute('wx-swiper', 'current', 1)">跳转到第二个</wx-button>
        </div>
        <div class="opr-cnt">
          <div class="opr-label">动画类型</div>
          <select @change="onUpdateWxSwiperEasingFunction">
            <option value="default" selected>default</option>
            <option value="linear">linear</option>
            <option value="easeInCubic">easeInCubic</option>
            <option value="easeOutCubic">easeOutCubic</option>
            <option value="easeInOutCubic">easeInOutCubic</option>
          </select>
        </div>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-view</div>
      <div class="comp-cnt">
        <wx-view class="wx-view">
          <div>普通 view</div>
        </wx-view>
        <wx-view class="wx-view" :hover-class="wxView.hoverClass">
          <div>带 hover 的 view</div>
        </wx-view>
        <wx-button class="wx-button" @click="onUpdateView">更新 hover 颜色</wx-button>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-icon</div>
      <div class="comp-cnt">
        <div>
          <wx-icon type="success" size="20"></wx-icon>
          <wx-icon type="success" size="30"></wx-icon>
          <wx-icon type="success" size="40"></wx-icon>
          <wx-icon type="success" size="50"></wx-icon>
          <wx-icon type="success" size="60"></wx-icon>
          <wx-icon type="success" size="70"></wx-icon>
        </div>
        <div>
          <wx-icon type="success" size="40" color="red"></wx-icon>
          <wx-icon type="success" size="40" color="orange"></wx-icon>
          <wx-icon type="success" size="40" color="yellow"></wx-icon>
          <wx-icon type="success" size="40" color="green"></wx-icon>
          <wx-icon type="success" size="40" color="rgb(0, 255, 255)"></wx-icon>
          <wx-icon type="success" size="40" color="blue"></wx-icon>
          <wx-icon type="success" size="40" color="purple"></wx-icon>
        </div>
        <div>
          <wx-icon type="success" size="40"></wx-icon>
          <wx-icon type="success_no_circle" size="40"></wx-icon>
          <wx-icon type="info" size="40"></wx-icon>
          <wx-icon type="warn" size="40"></wx-icon>
          <wx-icon type="waiting" size="40"></wx-icon>
          <wx-icon type="cancel" size="40"></wx-icon>
          <wx-icon type="download" size="40"></wx-icon>
          <wx-icon type="search" size="40"></wx-icon>
          <wx-icon type="clear" size="40"></wx-icon>
        </div>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-progress</div>
      <div class="comp-cnt">
        <wx-progress ref="wx-progress-update" class="wx-progress" :percent="wxProgress.percent1" :show-info="true" stroke-width="3" @activeend="log('[wx-progress]', $event.detail)"></wx-progress>
        <wx-progress ref="wx-progress-update" class="wx-progress" :percent="wxProgress.percent2" :active="true" stroke-width="6" @activeend="log('[wx-progress]', $event.detail)"></wx-progress>
        <wx-progress ref="wx-progress-update" class="wx-progress" :percent="wxProgress.percent3" :active="true" stroke-width="6" active-mode="forwards" @activeend="log('[wx-progress]', $event.detail)"></wx-progress>
        <wx-progress class="wx-progress" percent="60" :active="true" stroke-width="10" border-radius="5" @activeend="log('[wx-progress]', $event.detail)"></wx-progress>
        <wx-progress class="wx-progress" percent="80" color="#10AEFF" :active="true" stroke-width="14" duration="10" @activeend="log('[wx-progress]', $event.detail)"></wx-progress>
        <wx-button class="wx-button" @click="onUpdateWxProgress">更新进度</wx-button>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-rich-text</div>
      <div class="comp-cnt">
        <wx-rich-text class="wx-rich-text" space="emsp" :nodes="wxRichText.nodes1"></wx-rich-text>
        <wx-rich-text class="wx-rich-text" :nodes="wxRichText.nodes2"></wx-rich-text>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-text</div>
      <div class="comp-cnt">
        <div><wx-text class="wx-text">今天天气不错</wx-text></div>
        <div><wx-text ref="wx-text1" :user-select="true" :decode="true"></wx-text></div>
        <div ref="wx-text2"></div>
        <wx-button class="wx-button" @click="onUpdateWxText">更新内容</wx-button>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-button</div>
      <div class="comp-cnt wx-button-cnt">
        <wx-button class="wx-button" type="primary" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">页面主操作 Normal</wx-button>
        <wx-button class="wx-button" type="primary" :loading="true" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">页面主操作 Loading</wx-button>
        <wx-button class="wx-button" type="primary" :disabled="true" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">页面主操作 Disabled</wx-button>
        <wx-button class="wx-button" type="default" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">页面次要操作 Normal</wx-button>
        <wx-button class="wx-button" type="default" :disabled="true" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">页面次要操作 Disabled</wx-button>
        <wx-button class="wx-button" type="warn" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">警告类操作 Normal</wx-button>
        <wx-button class="wx-button" type="warn" :disabled="true" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">警告类操作 Disabled</wx-button>
        <wx-button class="wx-button" type="primary" :plain="true" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">按钮</wx-button>
        <wx-button class="wx-button" type="primary" :disabled="true" :plain="true" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">不可点击的按钮</wx-button>
        <wx-button class="wx-button" type="default" :plain="true" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">按钮</wx-button>
        <wx-button class="wx-button" type="default" :disabled="true" :plain="true" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">按钮</wx-button>
        <div>
          <wx-button class="wx-button mini-btn" type="primary" size="mini" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">按钮</wx-button>
          <wx-button class="wx-button mini-btn" type="default" size="mini" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">按钮</wx-button>
          <wx-button class="wx-button mini-btn" type="warn" size="mini" @tap="log('[wx-button] tap', $event)" @longpress="log('[wx-button] longpress', $event)">按钮</wx-button>
        </div>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-checkbox-group/wx-checkbox</div>
      <div class="comp-cnt">
        <div><wx-checkbox></wx-checkbox><span>未选中</span></div>
        <div><wx-checkbox :checked="true"></wx-checkbox><span>选中</span></div>
        <div><wx-checkbox :disabled="true"></wx-checkbox><span>禁用 1</span></div>
        <div><wx-checkbox :checked="true" :disabled="true"></wx-checkbox><span>禁用 2</span></div>
        <div><wx-checkbox :checked="true" color="#FF0000"></wx-checkbox><span>颜色 - 红</span></div>
        <wx-checkbox-group class="wx-checkbox-group" @change="log('[wx-checkbox] change', $event.detail)">
          <div><wx-checkbox :checked="true" value="中"></wx-checkbox><span>中国</span></div>
          <div><wx-checkbox :checked="true" value="俄"></wx-checkbox><span>俄罗斯</span></div>
          <div><wx-checkbox value="美"></wx-checkbox><span>美国</span></div>
          <div><wx-checkbox value="英"></wx-checkbox><span>英国</span></div>
          <div><wx-checkbox value="法"></wx-checkbox><span>法国</span></div>
        </wx-checkbox-group>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-form</div>
      <div class="comp-cnt">
        <wx-form @submit="log('[wx-form] submit', $event.detail)" @reset="wxForm.wxPicker.showText = '美国'; log('[wx-form] reset')">
          <div><wx-input class="wx-input" name="wx-input" value="wx-input" placeholder="请输入内容"></wx-input></div>
          <div><wx-textarea class="wx-textarea" name="wx-textarea" value="wx-textarea" placeholder="请输入内容"></wx-textarea></div>
          <div><wx-switch name="wx-switch" :checked="true"></wx-switch>wx-switch</div>
          <div><wx-slider name="wx-slider" value="77" :show-value="true"></wx-slider></div>
          <wx-checkbox-group class="wx-checkbox-group">
            <div><wx-checkbox name="wx-checkbox" :checked="true" value="中国"></wx-checkbox>中国</div>
            <div><wx-checkbox name="wx-checkbox" value="美国"></wx-checkbox>美国</div>
          </wx-checkbox-group>
          <wx-radio-group class="wx-radio-group">
            <div><wx-radio name="wx-radio" :checked="true" value="男"></wx-radio>男</div>
            <div><wx-radio name="wx-radio" value="女"></wx-radio>女</div>
          </wx-radio-group>
          <div>
            <wx-picker class="wx-picker" name="wx-picker" :range="wxForm.wxPicker.range" :value="wxForm.wxPicker.value" @change="wxForm.wxPicker.showText = wxForm.wxPicker.range[+$event.detail.value]">
              <div>{{wxForm.wxPicker.showText}}</div>
            </wx-picker>
          </div>
          <div>
            <wx-picker-view class="wx-picker-view" name="wx-picker-view" indicator-style="height: 50px;" :value="wxForm.wxPickerView.value">
              <wx-picker-view-column class="wx-picker-view-column">
                <div v-for="item in wxForm.wxPickerView.year" :key="item" class="item">{{item}}年</div>
              </wx-picker-view-column>
              <wx-picker-view-column class="wx-picker-view-column">
                <div v-for="item in wxForm.wxPickerView.month" :key="item" class="item">{{item}}月</div>
              </wx-picker-view-column>
              <wx-picker-view-column class="wx-picker-view-column">
                <div v-for="item in wxForm.wxPickerView.date" :key="item" class="item">{{item}}日</div>
              </wx-picker-view-column>
            </wx-picker-view>
          </div>
          <wx-button class="wx-button" form-type="submit">submit</wx-button>
          <wx-button class="wx-button" form-type="reset">reset</wx-button>
        </wx-form>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-input</div>
      <div class="comp-cnt">
        <wx-input class="wx-input" value="默认 value 值" @input="log('[wx-input] input', $event.detail)" @focus="log('[wx-input] focus', $event.detail)" @blur="log('[wx-input] blur', $event.detail)" @confirm="log('[wx-input] confirm', $event.detail)"/>
        <wx-input class="wx-input" placeholder="文本输入框" type="text" @input="log('[wx-input] input', $event.detail)"/>
        <wx-input class="wx-input" placeholder="整数输入框" type="number" @input="log('[wx-input] input', $event.detail)"/>
        <wx-input class="wx-input" placeholder="小数输入框" type="digit" @input="log('[wx-input] input', $event.detail)"/>
        <wx-input class="wx-input" placeholder="身份证输入框" type="idcard" @input="log('[wx-input] input', $event.detail)"/>
        <wx-input class="wx-input" placeholder="密码输入框" :password="true" @input="log('[wx-input] input', $event.detail)"/>
        <wx-input class="wx-input" placeholder="占位文本样式1" placeholder-style="color: red;" @input="log('[wx-input] input', $event.detail)"/>
        <wx-input class="wx-input" placeholder="占位文本样式2" placeholder-class="green" @input="log('[wx-input] input', $event.detail)"/>
        <wx-input class="wx-input" placeholder="禁用" :disabled="true" @input="log('[wx-input] input', $event.detail)"/>
        <wx-input class="wx-input" :placeholder="`最大输入长度为 ${wxInput.maxlength > 0 ? wxInput.maxlength : '无限'}`" :maxlength="wxInput.maxlength" @input="log('[wx-input] input', $event.detail)"/>
        <wx-button class="wx-button" type="default" @tap="wxInput.maxlength = wxInput.maxlength > 0 ? -1 : 10">修改上面输入框的 maxlength</wx-button>
        <wx-input class="wx-input" :focus="wxInput.focus" @blur="wxInput.focus = false" placeholder="自动聚焦" @input="log('[wx-input] input', $event.detail)"/>
        <wx-button class="wx-button" type="default" @tap="wxInput.focus = true">聚焦上面输入框</wx-button>
        <wx-input class="wx-input" placeholder="点击确认不失焦" :confirm-hold="true" @input="log('[wx-input] input', $event.detail)"/>
        <wx-input class="wx-input" ref="wx-input-cursor" value="焦点位置 -><- 在这里" cursor="7" @input="log('[wx-input] input', $event.detail)"/>
        <wx-button class="wx-button" type="default" @tap="setAttribute('wx-input-cursor', 'focus', true)">聚焦上面输入框</wx-button>
        <wx-input class="wx-input" ref="wx-input-select" value="后面这些文字：这些要被选中，到此就结束了" selection-start="7" selection-end="13" @input="log('[wx-input] input', $event.detail)"/>
        <wx-button class="wx-button" type="default" @tap="setAttribute('wx-input-select', 'focus', true)">聚焦上面输入框</wx-button>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-label</div>
      <div class="comp-cnt">
        <wx-checkbox-group @change="log('[wx-label] checkbox change', $event.detail)">
          <div>表单组件在 wx-label 内</div>
          <div><wx-label><wx-checkbox :checked="true" value="中国"></wx-checkbox>中国</wx-label></div>
          <div><wx-label><wx-checkbox value="美国"></wx-checkbox>美国</wx-label></div>
        </wx-checkbox-group>
        <wx-radio-group @change="log('[wx-label] radio change', $event.detail)">
          <div>wx-label 用 for 标识表单组件</div>
          <div><wx-radio id="label-radio-1" :checked="true" value="中国"></wx-radio><wx-label for="label-radio-1">中国</wx-label></div>
          <div><wx-radio id="label-radio-2" value="美国"></wx-radio><wx-label for="label-radio-2">美国</wx-label></div>
        </wx-radio-group>
        <wx-checkbox-group @change="log('[wx-label] checkbox change', $event.detail)">
          <div>wx-label 内有多个时选中第一个</div>
          <wx-label>
            <div><wx-checkbox value="中国"></wx-checkbox>中国</div>
            <div><wx-checkbox value="美国"></wx-checkbox>美国</div>
            <div>点击该 wx-label 下的文字默认选中第一个 wx-checkbox</div>
          </wx-label>
        </wx-checkbox-group>
        <div class="add-margin-top">
          <wx-label><wx-switch @change="log('[wx-label] switch change', $event.detail)"></wx-switch>wx-switch</wx-label>
        </div>
        <div class="add-margin-top">
          <wx-label><wx-switch type="checkbox" @change="log('[wx-label] switch change', $event.detail)"></wx-switch>wx-switch</wx-label>
        </div>
        <div class="add-margin-top">
          <wx-label><wx-button class="wx-button" @tap="log('[wx-label] button tap')">按钮</wx-button>wx-button</wx-label>
        </div>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-picker</div>
      <div class="comp-cnt">
        <wx-picker class="wx-picker" :range="wxPicker.range1" :value="wxPicker.value1" @change="wxPicker.showText1 = wxPicker.range1[+$event.detail.value]" @cancel="log('[wx-picker] cancel', $event)">
          <div>普通选择器：{{wxPicker.showText1}}</div>
        </wx-picker>
        <wx-picker class="wx-picker" header-text="selector" range-key="name" :range="wxPicker.range2" :value="wxPicker.value2" @change="wxPicker.showText2 = wxPicker.range2[+$event.detail.value].name" @cancel="log('[wx-picker] cancel', $event)">
          <div>普通选择器2：{{wxPicker.showText2}}</div>
        </wx-picker>
        <wx-picker class="wx-picker" mode="multiSelector" :range="wxPicker.range3" :value="wxPicker.value3" @change="wxPicker.showText3 = `${wxPicker.range3[0][+$event.detail.value[0]]} - ${wxPicker.range3[1][+$event.detail.value[1]]} - ${wxPicker.range3[2][+$event.detail.value[2]]}`" @cancel="log('[wx-picker] cancel', $event)" @columnchange="onWxpicker3ColumnChange">
          <div>多列选择器：{{wxPicker.showText3}}</div>
        </wx-picker>
        <wx-picker class="wx-picker" mode="multiSelector" range-key="name" header-text="multiSelector" :range="wxPicker.range4" :value="wxPicker.value4" @change="wxPicker.showText4 = `${wxPicker.range4[0][+$event.detail.value[0]].name} - ${wxPicker.range4[1][+$event.detail.value[1]].name}`" @cancel="log('[wx-picker] cancel', $event)" @columnchange="onWxpicker4ColumnChange">
          <div>多列选择器2：{{wxPicker.showText4}}</div>
        </wx-picker>
        <wx-picker class="wx-picker" mode="time" start="09:01" end="21:01" :value="wxPicker.value5" @change="wxPicker.value5 = $event.detail.value" @cancel="log('[wx-picker] cancel', $event)">
          <div>时间选择器：{{wxPicker.value5}}</div>
        </wx-picker>
        <wx-picker class="wx-picker" mode="date" start="2015-09-01" end="2020-09-01" :value="wxPicker.value6" @change="wxPicker.value6 = $event.detail.value" @cancel="log('[wx-picker] cancel', $event)">
          <div>日期选择器：{{wxPicker.value6}}</div>
        </wx-picker>
        <wx-picker class="wx-picker" mode="date" start="2015-09-01" end="2020-09-01" fields="month" :value="wxPicker.value7" @change="wxPicker.value7 = $event.detail.value" @cancel="log('[wx-picker] cancel', $event)">
          <div>日期选择器2：{{wxPicker.value7}}</div>
        </wx-picker>
        <wx-picker class="wx-picker" mode="date" start="2015-09-01" end="2020-09-01" fields="year" :value="wxPicker.value8" @change="wxPicker.value8 = $event.detail.value" @cancel="log('[wx-picker] cancel', $event)">
          <div>日期选择器2：{{wxPicker.value8}}</div>
        </wx-picker>
        <wx-picker class="wx-picker" mode="region" :value="wxPicker.value9" @change="wxPicker.showText9 = $event.detail.value.join('-')" @cancel="log('[wx-picker] cancel', $event)">
          <div>省市选择器：{{wxPicker.showText9}}</div>
        </wx-picker>
        <wx-picker class="wx-picker" mode="region" custom-item="全部" :value="wxPicker.value10" @change="wxPicker.showText10 = $event.detail.value.join('-')" @cancel="log('[wx-picker] cancel', $event)">
          <div>省市选择器2：{{wxPicker.showText10}}</div>
        </wx-picker>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-radio-group/wx-radio</div>
      <div class="comp-cnt">
        <div><wx-radio></wx-radio><span>未选中</span></div>
        <div><wx-radio :checked="true"></wx-radio><span>选中</span></div>
        <div><wx-radio :disabled="true"></wx-radio><span>禁用 1</span></div>
        <div><wx-radio :checked="true" :disabled="true"></wx-radio><span>禁用 2</span></div>
        <div><wx-radio :checked="true" color="#FF0000"></wx-radio><span>颜色 - 红</span></div>
        <wx-radio-group class="wx-radio-group" @change="log('[wx-radio] change', $event.detail)">
          <div><wx-radio :checked="true" value="中"></wx-radio><span>中国</span></div>
          <div><wx-radio value="俄"></wx-radio><span>俄罗斯</span></div>
          <div><wx-radio value="美"></wx-radio><span>美国</span></div>
          <div><wx-radio value="英"></wx-radio><span>英国</span></div>
          <div><wx-radio value="法"></wx-radio><span>法国</span></div>
        </wx-radio-group>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-picker-view/wx-picker-view-column</div>
      <div class="comp-cnt wx-picker-view-cnt">
        <wx-picker-view class="wx-picker-view" indicator-style="height: 50px;" :value="wxPickerView.value" @change="log('[wx-picker-view] change', $event.detail)" @pickstart="log('[wx-picker-view] pickstart', $event)" @pickend="log('[wx-picker-view] pickend', $event)">
          <wx-picker-view-column class="wx-picker-view-column">
            <div v-for="item in wxPickerView.year" :key="item" class="item">{{item}}年</div>
          </wx-picker-view-column>
          <wx-picker-view-column class="wx-picker-view-column">
            <div v-for="item in wxPickerView.month" :key="item" class="item">{{item}}月</div>
          </wx-picker-view-column>
          <wx-picker-view-column class="wx-picker-view-column">
            <div v-for="item in wxPickerView.date" :key="item" class="item">{{item}}日</div>
          </wx-picker-view-column>
          <wx-picker-view-column class="wx-picker-view-column">
            <div class="icon-cnt">
              <img class="icon" src="data:image/png;base64,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" />
            </div>
            <div class="icon-cnt">
              <img class="icon" src="data:image/png;base64,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" />
            </div>
          </wx-picker-view-column>
        </wx-picker-view>
        <div class="opr-cnt">
          <wx-button class="wx-button opr-button" @click="onUpdateWxPickerView">更新值（随机）</wx-button>
        </div>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-slider</div>
      <div class="comp-cnt">
        <wx-slider class="wx-slider" @change="log('[wx-slider] change', $event.detail)" @changing="log('[wx-slider] changing', $event.detail)"></wx-slider>
        <wx-slider class="wx-slider" min="1" max="21" step="2" value="15" @change="log('[wx-slider] change', $event.detail)" @changing="log('[wx-slider] changing', $event.detail)"></wx-slider>
        <wx-slider class="wx-slider" min="12.3" max="27.5" step="0.2" value="15" :show-value="true" @change="log('[wx-slider] change', $event.detail)" @changing="log('[wx-slider] changing', $event.detail)"></wx-slider>
        <wx-slider class="wx-slider" min="50" max="200" value="100" :show-value="true" @change="log('[wx-slider] change', $event.detail)" @changing="log('[wx-slider] changing', $event.detail)"></wx-slider>
        <wx-slider class="wx-slider" min="50" max="200" value="110" :disabled="true" @change="log('[wx-slider] change', $event.detail)" @changing="log('[wx-slider] changing', $event.detail)"></wx-slider>
        <wx-slider class="wx-slider" min="50" max="200" value="100" selected-color="red" color="#000" @change="log('[wx-slider] change', $event.detail)" @changing="log('[wx-slider] changing', $event.detail)"></wx-slider>
        <wx-slider class="wx-slider" min="50" max="200" value="100" active-color="red" background-color="#000" @change="log('[wx-slider] change', $event.detail)" @changing="log('[wx-slider] changing', $event.detail)"></wx-slider>
        <wx-slider class="wx-slider" min="50" max="200" value="100" block-size="15" block-color="red" @change="log('[wx-slider] change', $event.detail)" @changing="log('[wx-slider] changing', $event.detail)"></wx-slider>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-switch</div>
      <div class="comp-cnt">
        <wx-switch class="wx-switch" :checked="true" @change="log('[wx-switch]', $event.detail)"></wx-switch>
        <wx-switch class="wx-switch" :checked="true" :disabled="true" @change="log('[wx-switch]', $event.detail)"></wx-switch>
        <wx-switch class="wx-switch" :checked="true" color="red" @change="log('[wx-switch]', $event.detail)"></wx-switch>
        <wx-switch class="wx-switch" type="checkbox" @change="log('[wx-switch]', $event.detail)"></wx-switch>
        <wx-switch class="wx-switch" type="checkbox" :disabled="true" @change="log('[wx-switch]', $event.detail)"></wx-switch>
        <wx-switch class="wx-switch" type="checkbox" color="red" @change="log('[wx-switch]', $event.detail)"></wx-switch>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-textarea</div>
      <div class="comp-cnt">
        <wx-textarea class="wx-textarea" value="默认 value 值" @input="log('[wx-textarea] input', $event.detail)" @focus="log('[wx-textarea] focus', $event.detail)" @blur="log('[wx-textarea] blur', $event.detail)" @confirm="log('[wx-textarea] confirm', $event.detail)" @linechange="log('[wx-textarea] linechange', $event.detail)"/>
        <wx-textarea class="wx-textarea" placeholder="占位文本样式1" placeholder-style="color: red;" @input="log('[wx-textarea] input', $event.detail)"/>
        <wx-textarea class="wx-textarea" placeholder="占位文本样式2" placeholder-class="green" @input="log('[wx-textarea] input', $event.detail)"/>
        <wx-textarea class="wx-textarea" placeholder="禁用" :disabled="true" @input="log('[wx-textarea] input', $event.detail)"/>
        <wx-textarea class="wx-textarea" :placeholder="`最大输入长度为 ${wxTextarea.maxlength > 0 ? wxTextarea.maxlength : '无限'}`" :maxlength="wxTextarea.maxlength" @input="log('[wx-textarea] input', $event.detail)"/>
        <wx-button class="wx-button" type="default" @tap="wxTextarea.maxlength = wxTextarea.maxlength > 0 ? -1 : 10">修改上面 textarea 的 maxlength</wx-button>
        <wx-textarea class="wx-textarea" :focus="wxTextarea.focus" @blur="wxTextarea.focus = false" placeholder="默认不聚焦" @input="log('[wx-textarea] input', $event.detail)"/>
        <wx-button class="wx-button" type="default" @tap="wxTextarea.focus = true">聚焦上面 textarea</wx-button>
        <wx-textarea class="wx-textarea" placeholder="自动增高" :auto-height="true" @input="log('[wx-textarea] input', $event.detail)"/>
        <wx-button class="wx-button" type="default" @tap="wxTextarea.showFixedDialog = true">显示 fixed textarea</wx-button>
        <div class="fixed-dialog" v-if="wxTextarea.showFixedDialog">
          <div class="fixed-dialog-mask" @click="wxTextarea.showFixedDialog = false"></div>
          <div class="fixed-dialog-cnt">
            <wx-textarea class="wx-textarea" placeholder="点击灰色蒙层可关闭" :fixed="true" @input="log('[wx-textarea] input', $event.detail)"/>
          </div>
        </div>
        <wx-textarea class="wx-textarea" ref="wx-textarea-cursor" value="焦点位置 -><- 在这里" cursor="7" @input="log('[wx-textarea] input', $event.detail)"/>
        <wx-button class="wx-button" type="default" @tap="setAttribute('wx-textarea-cursor', 'focus', true)">聚焦上面输入框</wx-button>
        <wx-textarea class="wx-textarea" ref="wx-textarea-select" value="后面这些文字：这些要被选中，到此就结束了" selection-start="7" selection-end="13" @input="log('[wx-textarea] input', $event.detail)"/>
        <wx-button class="wx-button" type="default" @tap="setAttribute('wx-textarea-select', 'focus', true)">聚焦上面输入框</wx-button>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-image</div>
      <div class="comp-cnt">
        <div>缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 wx-image 元素</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="scaleToFill" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="aspectFit" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="aspectFill" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>缩放模式，宽度不变，高度自动变化，保持原图宽高比不变</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="widthFix" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>缩放模式，高度不变，宽度自动变化，保持原图宽高比不变</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="heightFix" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>裁剪模式，不缩放图片，只显示图片的顶部区域</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="top" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>裁剪模式，不缩放图片，只显示图片的底部区域</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="bottom" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>裁剪模式，不缩放图片，只显示图片的中间区域</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="center" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>裁剪模式，不缩放图片，只显示图片的左边区域</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="left" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>裁剪模式，不缩放图片，只显示图片的右边区域</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="right" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>裁剪模式，不缩放图片，只显示图片的左上边区域</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="top left" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>裁剪模式，不缩放图片，只显示图片的右上边区域</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="top right" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>裁剪模式，不缩放图片，只显示图片的左下边区域</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="bottom left" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>裁剪模式，不缩放图片，只显示图片的右下边区域</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" mode="bottom right" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>默认</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>长按报错</div>
        <wx-image class="wx-image" :show-menu-by-longpress="true" style="width: 200px; height: 200px; background-color: #eee;" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] load', $event.detail)"></wx-image>
        <div>error</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" src="https://june.haha/123456.jpg" @load="log('[wx-image] load', $event.detail)" @error="log('[wx-image] error', $event.detail)"></wx-image>
        <div>lazy-load</div>
        <wx-image class="wx-image" style="width: 200px; height: 200px; background-color: #eee;" :lazy-load="true" src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" @load="log('[wx-image] lazy-load load', $event.detail)" @error="log('[wx-image] lazy-load error', $event.detail)"></wx-image>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-canvas</div>
      <div class="comp-cnt">
        <div>2d Canvas</div>
        <wx-canvas
          ref="wx-canvas"
          class="wx-canvas"
          type="2d"
          :disable-scroll="wxCanvas.disableScroll"
          @canvastouchstart="log('[wx-canvas] touchstart', $event)"
          @canvastouchmove="log('[wx-canvas] touchmove', $event)"
          @canvastouchend="log('[wx-canvas] touchend', $event)"
          @canvastouchcancel="log('[wx-canvas] touchcancel', $event)"
          @longtap="log('[wx-canvas] longtap', $event)"
          @error="log('[wx-canvas] error', $event)"
        >
          <Inner style="margin-top: 100px;"></Inner>
        </wx-canvas>
        <div class="opr-cnt">
          <div class="opr-label">禁止滚动</div>
          <wx-switch @change="wxCanvas.disableScroll = $event.detail.value.toString()"></wx-switch>
        </div>
        <div>2d Canvas 动画</div>
        <wx-canvas ref="wx-canvas-animation" class="wx-canvas-2" type="2d"></wx-canvas>
        <wx-canvas ref="wx-canvas-webgl" class="wx-canvas-2" type="webgl"></wx-canvas>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-capture</div>
      <div class="comp-cnt">
        <div @touchstart="log('root touchstart')" @touchend="log('root touchend')" @click="log('root click')">
          <div>touchstart -> root touchstart -> touchend -> root touchend -> click -> root click</div>
          <wx-button class="wx-button" @touchstart="log('touchstart')" @touchend="log('touchend')" @click="log('click')">normal event</wx-button>
          <div>parent touchstart -> touchstart -> root touchstart -> parent touchend -> touchend -> root touchend -> parent click -> click -> root click</div>
          <wx-capture @touchstart="log('parent touchstart')" @touchend="log('parent touchend')" @click="log('parent click')">
            <wx-button class="wx-button" @touchstart="log('touchstart')" @touchend="log('touchend')" @click="wxCapture.eventCount++; log('click')">capture-inner({{wxCapture.eventCount}})</wx-button>
          </wx-capture>
        </div>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-catch</div>
      <div class="comp-cnt">
        <div @touchstart="log('root touchstart')" @touchend="log('root touchend')" @click="log('root click')">
          <div>touchstart -> parent touchstart -> touchend -> parent touchend</div>
          <wx-catch @touchstart="log('parent touchstart')" @touchend="log('parent touchend')" @click="log('parent click')">
            <wx-button class="wx-button" @touchstart="log('touchstart')" @touchend="log('touchend')" @click="wxCatch.eventCount++; log('click')">catch-inner1({{wxCatch.eventCount}})</wx-button>
          </wx-catch>
          <div>touchstart -> touchend -> click -> parent click</div>
          <wx-catch @click="log('parent click')">
            <wx-button class="wx-button" @touchstart="log('touchstart')" @touchend="log('touchend')" @click="wxCatch.eventCount++; log('click')">catch-inner2({{wxCatch.eventCount}})</wx-button>
          </wx-catch>
          <wx-catch>catch-inner3({{wxCatch.eventCount}})</wx-catch>
        </div>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">wx-animation</div>
      <div class="comp-cnt">
        <div class="event-cnt">
          <div>transition end</div>
          <wx-animation :class="['event-t', wxAnimation.transition ? 'event-t-s' : 'event-t-e']" @transitionend="log('transition end')"></wx-animation>
          <wx-button class="wx-button" @click="wxAnimation.transition = !wxAnimation.transition">transition</wx-button>
        </div>
        <div class="event-cnt">
          <div>animation start -> animation iteration -> animation end</div>
          <wx-animation class="event-a" @animationstart="log('animation start')" @animationiteration="log('animation iteration')" @animationend="log('animation end')"></wx-animation>
        </div>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">kbone-attribute-map</div>
      <div class="comp-cnt">
        <wx-input :kbone-attribute-map="kboneAttributeMap" class="wx-input"/>
        <wx-button class="wx-button" type="default" @tap="onSetKboneAttributeMap1">操作1</wx-button>
        <wx-button class="wx-button" type="default" @tap="onSetKboneAttributeMap2">操作2</wx-button>
        <wx-button class="wx-button" type="default" @tap="onSetKboneAttributeMap3">reset</wx-button>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">kbone-event-map</div>
      <div class="comp-cnt">
        <wx-input placeholder="这是一个输入框" :kbone-event-map="kboneEventMap" class="wx-input"/>
        <wx-button class="wx-button" type="default" @tap="onSetKboneEventMap1">操作1</wx-button>
        <wx-button class="wx-button" type="default" @tap="onSetKboneEventMap2">操作2</wx-button>
        <wx-button class="wx-button" type="default" @tap="onSetKboneEventMap3">reset</wx-button>
      </div>
    </wx-view>
    <wx-view class="item">
      <div class="title">操作</div>
      <div class="comp-cnt">
        <wx-button class="wx-button" @click="do$$getBoundingClientRect">$$getBoundingClientRect</wx-button>
        <wx-button class="wx-button" @click="do$$getComputedStyle">$$getComputedStyle</wx-button>
        <wx-button class="wx-button" type="primary" @click="onRemoveAll">删除全部</wx-button>
      </div>
    </wx-view>
  </div>
</template>
<script>
import Inner from './Inner.vue'

export default {
  name: 'App',
  components: {Inner},
  data() {
    const now = new Date()

    // wx-picker-view
    const wxPickerViewYear = []
    const wxPickerViewMonth = []
    const wxPickerViewDate = []
    for (let i = 1990; i <= now.getFullYear(); i++) wxPickerViewYear.push(i)
    for (let i = 1; i <= 12; i++) wxPickerViewMonth.push(i)
    for (let i = 1; i <= 31; i++) wxPickerViewDate.push(i)

    return {
      show: true,
      wxMovableView: {
        x: 0,
        y: 0,
        inertia: true,
        outOfBounds: true,
        disabled: undefined,
        animation: undefined,
        scaleArea: undefined,
        damping: undefined,
        friction: undefined,
        scale: true,
        scaleValue: 1,
        scaleMin: undefined,
        scaleMax: undefined,
        count: 0,
        addDirection: false,
      },
      wxScrollView: {
        y: {
          scrollWithAnimation: true,
          refresherEnabled: undefined,
          refresherCustom: false,
        },
        x: {
          scrollWithAnimation: true,
        },
      },
      wxSwiper: {
        indicatorDots: true,
        autoplay: undefined,
        circular: undefined,
        vertical: undefined,
        margin: undefined,
        snapToEdge: undefined,
        skipHiddenItemLayout: undefined,
        kboneEnableWheel: undefined,
        indicatorColor: undefined,
        interval: undefined,
        duration: undefined,
        totalItems: 3,
        charString: 'ABCDEF',
        displayMultipleItems: undefined,
        easingFunction: undefined,
      },
      wxView: {
        hoverClass: 'red',
      },
      wxProgress: {
        percent1: 20,
        percent2: 40,
        percent3: 40,
      },
      wxRichText: {
        nodes1: `<div class="div_class">
          <h1>Title</h1>
          <p class="p">
              Life is&nbsp;<i>like</i>&nbsp;a box of
              <b>&nbsp;chocolates</b>.
          </p>
        </div>`,
        nodes2: [{
          name: 'div',
          attrs: {
            class: 'div_class',
            style: 'line-height: 60px; color: #1AAD19;'
          },
          children: [{
            type: 'text',
            text: 'You never know what you\'re gonna get.'
          }]
        }],
      },
      wxForm: {
        wxPicker: {
          range: ['美国', '中国', '巴西', '日本'],
          value: 1,
          showText: '中国',
        },
        wxPickerView: {
          value: [9999, 1, 1],
          year: wxPickerViewYear,
          month: wxPickerViewMonth,
          date: wxPickerViewDate,
        },
      },
      wxInput: {
        focus: true,
        maxlength: 10,
      },
      wxTextarea: {
        focus: false,
        maxlength: 10,
        showFixedDialog: false,
      },
      wxPicker: {
        range1: ['美国', '中国', '巴西', '日本'],
        value1: 1,
        showText1: '中国',
        range2: [{name: '美国'}, {name: '中国'}, {name: '巴西'}, {name: '日本'}],
        value2: 1,
        showText2: '中国',
        range3: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
        value3: [0, 0, 0],
        showText3: '无脊柱动物 - 扁性动物 - 猪肉绦虫',
        range4: [[{name: '国家'}, {name: '城市'}], [{name: '中国'}, {name: '日本'}]],
        value4: [0, 0],
        showText4: '国家 - 中国',
        value5: '12:01',
        value6: '2016-09-01',
        value7: '2016-09',
        value8: '2016',
        value9: ['广东省', '广州市', '海珠区'],
        showText9: '广东省-广州市-海珠区',
        value10: ['广东省', '广州市', '海珠区'],
        showText10: '广东省-广州市-海珠区',

      },
      wxPickerView: {
        value: [9999, 1, 1],
        year: wxPickerViewYear,
        month: wxPickerViewMonth,
        date: wxPickerViewDate,
      },
      wxCanvas: {
        disableScroll: undefined,
      },
      wxCapture: {
        eventCount: 0,
      },
      wxCatch: {
        eventCount: 0,
      },
      wxAnimation: {
        transition: false,
      },
      kboneAttributeMap: {
        placeholder: '这是一个输入框',
      },
      kboneEventMap: {
        input: this.log.bind(this, '[kbone-event-map] input')
      },
    }
  },
  mounted() {
    // wx-text
    this.$refs['wx-text1'].innerText = '&gt; this is first line\n&gt; this is second line'

    // wx-canvas
    this.$refs['wx-canvas'].$$prepare().then(domNode => {
      domNode.width = 300
      domNode.height = 200
      const context = domNode.getContext('2d')

      context.strokeStyle = '#00ff00'
      context.lineWidth = 5
      context.rect(0, 0, 200, 200)
      context.stroke()
      context.strokeStyle = '#ff0000'
      context.lineWidth = 2
      context.moveTo(160, 100)
      context.arc(100, 100, 60, 0, 2 * Math.PI, true)
      context.moveTo(140, 100)
      context.arc(100, 100, 40, 0, Math.PI, false)
      context.moveTo(85, 80)
      context.arc(80, 80, 5, 0, 2 * Math.PI, true)
      context.moveTo(125, 80)
      context.arc(120, 80, 5, 0, 2 * Math.PI, true)
      context.stroke()
    }).catch(console.error)
    this.$refs['wx-canvas-animation'].$$prepare().then(domNode => {
      const context = domNode.getContext('2d')
      const dpr = window.devicePixelRatio

      domNode.width = 305 * dpr
      domNode.height = 305 * dpr
      context.scale(dpr, dpr)

      const p = {
        x: 150,
        y: 150,
        vx: 2,
        vy: 2
      }
      const renderLoop = () => {
        context.clearRect(0, 0, 305, 305)
        
        // 球
        p.x += p.vx
        p.y += p.vy
        if (p.x >= 300) p.vx = -2
        if (p.x <= 7) p.vx = 2
        if (p.y >= 300) p.vy = -2
        if (p.y <= 7) p.vy = 2

        function ball(x, y) {
          context.beginPath()
          context.arc(x, y, 5, 0, Math.PI * 2)
          context.fillStyle = '#1aad19'
          context.strokeStyle = 'rgba(1,1,1,0)'
          context.fill()
          context.stroke()
        }

        ball(p.x, 150)
        ball(150, p.y)
        ball(300 - p.x, 150)
        ball(150, 300 - p.y)
        ball(p.x, p.y)
        ball(300 - p.x, 300 - p.y)
        ball(p.x, 300 - p.y)
        ball(300 - p.x, p.y)

        domNode.requestAnimationFrame(renderLoop)
      }
      domNode.requestAnimationFrame(renderLoop)
    })
    this.$refs['wx-canvas-webgl'].$$prepare().then(domNode => {
      const vs = `
        precision mediump float;

        attribute vec2 vertPosition;
        attribute vec3 vertColor;
        varying vec3 fragColor;

        void main() {
          gl_Position = vec4(vertPosition, 0.0, 1.0);
          fragColor = vertColor;
        }
      `

      const fs = `
        precision mediump float;

        varying vec3 fragColor;
        void main() {
          gl_FragColor = vec4(fragColor, 1.0);
        }
      `

      const triangleVertices = [
        0.0, 0.5, 1.0, 1.0, 0.0,
        -0.5, -0.5, 0.7, 0.0, 1.0,
        0.5, -0.5, 0.1, 1.0, 0.6
      ]

      domNode.width = 305
      domNode.height = 305
      const gl = domNode.getContext('webgl')
      if (!gl) {
        console.error('gl init failed', gl)
        return
      }
      gl.viewport(0, 0, 305, 305)
      const vertShader = gl.createShader(gl.VERTEX_SHADER)
      gl.shaderSource(vertShader, vs)
      gl.compileShader(vertShader)

      const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
      gl.shaderSource(fragShader, fs)
      gl.compileShader(fragShader)

      const prog = gl.createProgram()
      gl.attachShader(prog, vertShader)
      gl.attachShader(prog, fragShader)
      gl.deleteShader(vertShader)
      gl.deleteShader(fragShader)
      gl.linkProgram(prog)
      gl.useProgram(prog)

      const draw = () => {
        const triangleVertexBufferObject = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

        const positionAttribLocation = gl.getAttribLocation(prog, 'vertPosition')
        const colorAttribLocation = gl.getAttribLocation(prog, 'vertColor')
        gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0)
        gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT)

        gl.enableVertexAttribArray(positionAttribLocation)
        gl.enableVertexAttribArray(colorAttribLocation)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        domNode.requestAnimationFrame(draw)
      }

      domNode.requestAnimationFrame(draw)
    })
  },
  methods: {
    log(...args) {
      console.log.apply(console, args)
    },

    setAttribute(ref, name, value) {
      this.$refs[ref].setAttribute(name, value)
    },

    moveWxMovableView(x, y) {
      if (x === undefined && y === undefined) {
        x = ~~(Math.random() * 300)
        y = ~~(Math.random() * 300)
      }
      x = Math.min(Math.max(x, 0), 300)
      y = Math.min(Math.max(y, 0), 300)
      this.wxMovableView.x = x
      this.wxMovableView.y = y
      this.$refs['wx-movable-view'].setAttribute('x', x)
      this.$refs['wx-movable-view'].setAttribute('y', y)
    },

    scaleWxMovableView(scale) {
      if (scale === undefined) {
        scale = (Math.random() * 2.5) + 0.5
      }
      scale = Math.min(Math.max(scale, 0.5), 3)
      this.wxMovableView.scaleValue = scale
      this.$refs['wx-movable-view'].setAttribute('scale-value', scale)
    },

    onScrollViewYRefresherPulling(evt) {
      this.log('[wx-scroll-view refresherpulling]', evt.detail)
      const refreshContainer = this.$refs['refresh-container']
      if (refreshContainer) {
        const p = Math.min(evt.detail.dy / 80, 1)
        refreshContainer.style.opacity = p
        refreshContainer.style.transform = `scale(${p})`
        window.$$forceRender()
      }
    },

    onScrollViewYRefresherRefresh(evt) {
      this.log('[wx-scroll-view refresherrefresh]', evt.detail)
      setTimeout(() => this.setAttribute('wx-scroll-view-y', 'refresher-triggered', false), 1000)
    },

    onUpdateWxSwiperShowItems(evt) {
      this.wxSwiper.displayMultipleItems = evt.detail.value
      if (evt.detail.value === 2) this.wxSwiper.totalItems = 5
      if (evt.detail.value === 3) this.wxSwiper.totalItems = 6
    },

    onUpdateWxSwiperEasingFunction(evt) {
      let value = 'default'
      evt.target.querySelectorAll('option').forEach(option => {
        if (option.selected) value = option.value
      })

      this.wxSwiper.easingFunction = value
    },

    onUpdateView() {
      this.wxView.hoverClass = this.wxView.hoverClass === 'red' ? 'green' : 'red'
    },

    onUpdateWxProgress() {
      this.wxProgress.percent1 = 80
      this.wxProgress.percent2 = 80
      this.wxProgress.percent3 = 80
    },

    onUpdateWxText() {
      this.$refs['wx-text2'].innerHTML = '<wx-text id="wx-text-decode-1" decode="true"></wx-text><wx-text id="wx-text-decode-2"></wx-text>'
      this.$nextTick(() => {
        document.getElementById('wx-text-decode-1').innerText = '&gt; insert 1'
        document.getElementById('wx-text-decode-2').innerText = '&gt; insert 2'
      })
    },

    onWxpicker3ColumnChange(evt) {
      const value = JSON.parse(JSON.stringify(this.wxPicker.value3)) // 深拷贝
      const range = JSON.parse(JSON.stringify(this.wxPicker.range3)) // 深拷贝
      value[evt.detail.column] = +evt.detail.value
      switch (evt.detail.column) {
        case 0:
          switch (value[0]) {
            case 0:
              range[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']
              range[2] = ['猪肉绦虫', '吸血虫']
              break
            case 1:
              range[1] = ['鱼', '两栖动物', '爬行动物']
              range[2] = ['鲫鱼', '带鱼']
              break
          }
          value[1] = 0
          value[2] = 0
          break;
        case 1:
          switch (value[0]) {
            case 0:
              switch (value[1]) {
                  case 0:
                    range[2] = ['猪肉绦虫', '吸血虫']
                    break
                  case 1:
                    range[2] = ['蛔虫']
                    break
                  case 2:
                    range[2] = ['蚂蚁', '蚂蟥']
                    break
                  case 3:
                    range[2] = ['河蚌', '蜗牛', '蛞蝓']
                    break
                  case 4:
                    range[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物']
                    break
                }
                break;
              case 1:
                switch (value[1]) {
                  case 0:
                    range[2] = ['鲫鱼', '带鱼']
                    break
                  case 1:
                    range[2] = ['青蛙', '娃娃鱼']
                    break
                  case 2:
                    range[2] = ['蜥蜴', '龟', '壁虎']
                    break
                }
                break
            }
            value[2] = 0
            break
      }
      this.wxPicker.value3 = value
      this.wxPicker.range3 = range
    },

    onWxpicker4ColumnChange(evt) {
      const value = JSON.parse(JSON.stringify(this.wxPicker.value4)) // 深拷贝
      const range = JSON.parse(JSON.stringify(this.wxPicker.range4)) // 深拷贝
      value[evt.detail.column] = +evt.detail.value
      if (evt.detail.column === 0) {
        if (value[0] === 0) {
          range[1] = [{name: '中国'}, {name: '日本'}]
        } else if (value[0] === 1) {
          range[1] = [{name: '北京'}, {name: '东京'}]
        }
        value[1] = 0
      }
      this.wxPicker.value4 = value
      this.wxPicker.range4 = range
    },

    onUpdateWxPickerView() {
      const now = new Date()
      const year = Math.floor(Math.random() * (now.getFullYear() + 1 - 1990))
      const month = Math.floor(Math.random() * 12)
      const date = Math.floor(Math.random() * 31)
      const daytime = Math.random() >= 0.5 ? 1 : 0
      console.log('[wx-picker-view] will update value ->', [year, month, date, daytime])
      this.wxPickerView.value = [year, month, date, daytime]
    },

    onSetKboneAttributeMap1() {
      this.kboneAttributeMap = {
        value: '焦点位置 -><- 在这里',
        cursor: 7,
        focus: true,
      }
    },

    onSetKboneAttributeMap2() {
      this.kboneAttributeMap = {
        value: '后面这些文字：这些要被选中，到此就结束了',
        'selection-start': 7,
        'selection-end': 13,
        focus: true,
      }
    },

    onSetKboneAttributeMap3() {
      this.kboneAttributeMap = {
        placeholder: '这是一个输入框',
      }
    },

    onSetKboneEventMap1() {
      this.kboneEventMap = {
        focus: this.log.bind(this, '[kbone-event-map] focus'),
        blur: this.log.bind(this, '[kbone-event-map] blur'),
      }
    },

    onSetKboneEventMap2() {
      this.kboneEventMap = {
        focus: this.log.bind(this, '[kbone-event-map] focus'),
        change: this.log.bind(this, '[kbone-event-map] change'),
      }
    },

    onSetKboneEventMap3() {
      this.kboneEventMap = {
        input: this.log.bind(this, '[kbone-event-map] input'),
      }
    },

    do$$getBoundingClientRect(evt) {
      evt.target.$$getBoundingClientRect().then(console.log)
    },

    do$$getComputedStyle(evt) {
      window.$$getComputedStyle(evt.target, ['backgroundColor', 'fontSize']).then(console.log)
    },

    onRemoveAll() {
      this.show = false
    },
  },
}
</script>
<style>
.cnt {
  margin: 30px;
}
@media (prefers-color-scheme: dark) {
  html {
    background-color: #222;
    color: #fff;
  }
  .title {
    color: #000;
  }
}
.title {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  background-color: #b8e8ab;
  padding-left: 20px;
}
.add-margin-top {
  margin-top: 10px;
}
.comp-cnt {
  padding: 10px;
}
.red {
  color: red;
}
.green {
  color: green;
}
.opr-cnt {
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.opr-label, .opr-button  {
  margin: 0 10px 10px;
}
.opr-box {
  flex: 1;
}
.fixed-dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
}
.fixed-dialog .fixed-dialog-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
}
.fixed-dialog .fixed-dialog-cnt {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 200px;
  margin-left: -150px;
  margin-top: -150px;
  background-color: #fff;
  border-radius: 10px;
}
.fixed-dialog .wx-textarea {
  width: 200px;
  height: 100px;
  margin: 50px;
}
.wx-movable-area {
  width: 300px;
  height: 300px;
  margin: 20px 0;
  background-color: #ccc;
  overflow: hidden;
  z-index: 0;
}
.wx-movable-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  background: #1AAD19;
  color: #fff;
  cursor: pointer;
  user-select: none;
  z-index: 10;
}
.wx-scroll-view-y {
  width: 100%;
  height: 125px;
}
.wx-scroll-view-x {
  width: 300px;
  height: 125px;
}
.wx-scroll-view-cnt .inner2-x {
  display: flex;
}
.wx-scroll-view-cnt .block {
  width: 100%;
  height: 50px;
}
.wx-scroll-view-cnt .inner2-x .block {
  flex: 0 0 125px;
  width: 125px;
  height: 125px;
}
.wx-scroll-view-cnt .block1 {
  background: #dff0d8;
}
.wx-scroll-view-cnt .block2 {
  background: #f5f5f5;
}
.wx-scroll-view-cnt .block3 {
  background: #d9edf7;
}
.wx-scroll-view-cnt .block4 {
  background: #fcf8e3;
}
.wx-scroll-view-cnt .block5 {
  background: #f2dede;
}
.refresh-container {
  display: block;
  width: 100%;
  height: 80px;
  line-height: 80px;
  background: blue;
  display: flex;
  align-items: center;
}
.refresh-container-text {
  position: absolute;
  text-align: center;
  width: 100%;
  color: white;
}
.wx-swiper {
  background-color: #BBB;
}
.wx-swiper-item-view {
  display: block;
  line-height: 150px;
  height: 150px;
  text-align: center;
  position: relative;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
}
.wx-swiper-item-view-1 {
  background-color: #1AAD19;
  color: #FFFFFF;
}
.wx-swiper-item-view-2 {
  background-color: #2782D7;
  color: #FFFFFF;
}
.wx-swiper-item-view-3 {
  background-color: #F1F1F1;
  color: #353535;
}
.wx-swiper-item-view-4 {
  background-color: #5bc0de;
  color: #FFFFFF;
}
.wx-swiper-item-view-5 {
  background-color: #f0ad4e;
  color: #FFFFFF;
}
.wx-swiper-item-view-6 {
  background-color: #d9534f;
  color: #FFFFFF;
}
.wx-view, .wx-progress, .wx-rich-text, .comp-cnt .wx-button {
  margin-bottom: 10px;
}
.wx-checkbox-group, .wx-radio-group {
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
}
.wx-input {
  width: 100%;
}
.wx-textarea {
  border: 1px solid #a4a4a4;
  border-radius: 10px;
  width: 100%;
  height: 50px;
}
.wx-picker-view {
  width: 100%;
  height: 300px;
}
.wx-picker-view-column .item {
  line-height: 50px;
  text-align: center;
}
.wx-picker-view-column .icon-cnt {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.wx-picker-view-column .icon {
  width: 25px;
  height: 25px;
}
.wx-slider {
  margin-bottom: 30px;
}
.wx-textarea {
  margin: 10px 0;
}
.wx-canvas {
  width: 300px;
  height: 200px;
}
.wx-canvas-2 {
  width: 305px;
  height: 305px;
}
.event-cnt {
  position: relative;
  height: 130px;
}
.event-t, .event-a {
  left: 0;
  width: 50px;
  height: 50px;
  background-color: red;
  position: absolute;
  transition: all 0.5s;
}
.event-t {
  top: 80px;
}
.event-a {

  top: 50px;
}
.event-t-s {
  left: 50px;
}
.event-t-e {
  left: 0;
}
@keyframes event-aa {
  0% {
    left: 0;
  }
  50% {
    left: 50px
  }
  100% {
    left: 0;
  }
}
.event-a {
  animation: 1s ease 0s 8 event-aa;
}
</style>
