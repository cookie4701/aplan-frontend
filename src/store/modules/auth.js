import axios from "axios";
import {apiHost} from "../../config";

export default {
    state: {
        status: '',
        token: localStorage.getItem('user-token') || '',
        user: {},
	    moderator : localStorage.getItem('is-moderator') ||'', //false,
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

        auth_success(state, payload) {
            state.status = 'success'
            state.token = payload.token
            state.user = payload.user
            state.moderator = payload.moderator
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
			const payload = [];
			payload.token = resp.data.token
                        payload.user = resp.data.user
			payload.moderator = resp.data.isModerator
                        localStorage.setItem('user-token', resp.data.token);
                        localStorage.setItem('is-moderator', resp.data.isModerator);
                        axios.defaults.headers.common['Authorization'] = resp.data.token;
                        commit('auth_success', payload);
                        resolve(resp);
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
                delete axios.defaults.headers.common['Authorization'];
                resolve()
            })
        }
    }
}
