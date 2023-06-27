import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            messagesHistory: ['salut1', 'salut2', "salut3", "salut4"],
            convHistory: {}
        }

    },
    mutations: {


    },
    actions: {
        login({ commit, getters }, datas) {
            return new Promise((resolve) => { 
                axios.post(getters.urlApi + "/login", datas).then(
                    response => {
                            let token = response.data.access_token
                            let decodedToken = jwtDecode(token)
                            let role = decodedToken.role;
                            commit("login", response.data);
                            resolve({'role': role, 'data': response.data});
                        }
                )
                .catch(function (error) {
                    console.log(error)
                    resolve(false);
                });
            });
        },
    },
    getters: {
        messagesHistory: state => state.messagesHistory,
        convHistory: state => state.convHistory,

    }
})

export default store;