import Vue from 'vue'
import Vuex from 'vuex'
import * as kbone from 'kbone-tool'

// 使用全局状态，意味着多个页面需要共同 observe 一个对象，存在 observer 对象被覆盖的可能性，此方法的调用是为了确保每个页面可以拿到准确的 observer
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
