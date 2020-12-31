import axios from "axios";
import {apiHost} from "../../config";

export default {
    state: {
        status: '',
        token: localStorage.getItem('user-token') || '',
        user: {}
    },
    getters: {
        isLoggedIn: state => !!state.token,
	isModerator: state => state.moderator,
        authStatus: state => state.status
    },
    setters : {

    },
    mutations : {
        auth_request(state) {
            state.status = 'loading'
        },

        auth_success(state, token, user, moderator) {
            state.status = 'success'
            state.token = token
            state.user = user
            state.moderator = moderator
        },
        auth_error(state) {
            state.status = 'error'
        },
        logout(state) {
            state.status = ''
            state.token = ''
            state.moderator = false
        }
    },
    actions : {
        login({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({url: apiHost + '/rest/auth/login.php', data: user, method: 'POST'})
                    .then(resp => {
                        const token = resp.data.token
                        const user = resp.data.user
			const moderator = resp.data.isModerator
                        localStorage.setItem('user-token', token)
                        axios.defaults.headers.common['Authorization'] = token
                        commit('auth_success', token, user, moderator)
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('auth_error')
                        localStorage.removeItem('user-token')
                        reject(err)
                    })
            })
        },
        logout({commit}) {
            return new Promise((resolve) => {
                commit('logout')
                localStorage.removeItem('user-token')
                delete axios.defaults.headers.common['Authorization']
                resolve()
            })
        }
    }
}
