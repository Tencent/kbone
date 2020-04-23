import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore() {
    const state = window.$$global.state || {
        count: 0,
        data: {},
    }
    window.$$global.state = state

    return new Vuex.Store({
        state,
        actions: {
            FETCH_DATA: ({commit}, data) => {
                setTimeout(() => {
                    commit('SET_DATA', data)
                }, 100)
            },
        },
        mutations: {
            SET_DATA: (state, data) => {
                state.count++
                Vue.set(state.data, 'name', data.name)
            },
        },
    });
}
