export default {
    state: {
        collapse: false,//侧边栏折叠状态
    },
    getters: {
        collapse(state) {
            return state.collapse
        }
    },
    mutations: {
        onCollapse(state) {
            state.collapse =!state.collapse
        }
    }
}