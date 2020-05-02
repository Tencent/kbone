import Vue from 'vue'
import Vuex from 'vuex'
// import * as kbone from 'kbone-tool'

// kbone.vue.useGlobal()

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
