import Vue from 'vue'
import Vuex from 'vuex'
import * as kbone from 'kbone-tool'

// 多页面共享 vuex state 的时候，vue 会在 state 上重复设置 observer 进行覆盖。此方法可保证逻辑中获取 observer 时始终是栈顶页面设置的 observer，同时确保每次修改数据可以将更新通知到所有页面
kbone.vue.useGlobal()

Vue.use(Vuex)

export function createStore() {
    const state = window.$$global.state || {
        count: 0,
        info: {},
        list: [],
    }
    window.$$global.state = state

    return new Vuex.Store({
        state,
        actions: {
            FETCH_DATA({commit}, data) {
                setTimeout(() => {
                    commit('SET_DATA', data)
                }, 100)
            },

            FETCH_LIST({commit}, data) {
                setTimeout(() => {
                    commit('SET_LIST', data)
                }, 100)
            },
        },
        mutations: {
            SET_DATA(state, data) {
                state.count++
                Vue.set(state, 'say', data.say)
                Vue.set(state.info, 'name', data.name)
            },

            SET_LIST: (state, data) => {
                state.list.push(data.count)
                if (state.list.length > 3) state.list.shift()
            },
        },
    })
}
