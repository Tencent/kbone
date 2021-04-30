import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore() {
    const state = window.$$global.state || {
        count: 0,
        info: {},
        list: [],
        listCount: 0,
    }
    window.$$global.state = state

    const store = new Vuex.Store({
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

            SET_LIST: state => {
                state.listCount++
                state.list.push(state.listCount)
                if (state.list.length > 3) state.list.shift()
            },
        },
    })

    // 退出页面时来一次 state 的深拷贝
    const onShow = () => {
        store.replaceState(window.$$global.state)
    }
    const onHide = () => {
        window.$$global.state = JSON.parse(JSON.stringify(store.state))
    }
    window.addEventListener('wxshow', onShow)
    window.addEventListener('wxhide', onHide)
    window.addEventListener('wxunload', onHide)

    return store
}
