import axios from "axios";
import {apiHost} from "../../config";


export default {
    state: {
        statusWorkareaRequest : 'none',
        workareas : []
    },
    getters: {},
    setters: {},
    mutations: {
        fetchWorkareasSuccess(state, data) {
            state.statusWorkareaRequest = 'success';
            state.workareas = data;
        },
        fetchWorkareasPending(state) {
            state.statusWorkareaRequest = 'pending';
        },
        fetchWorkareasError(state) {
            state.statusWorkareaRequest = 'error';
        },
        updateWorkareasSuccess(state) {
            state.statusWorkareaRequest = 'success';
        },
        updateWorkareasPending(state) {
            state.statusWorkareaRequest = 'pending';
        },
        updateWorkareasError(state) {
            state.statusWorkareasRequest = 'error';
        },
        createWorkareaSuccess(state, data) {
            state.statusWorkareaRequest = 'success';
            state.workareas = data;
        },
        createWorkareaPending(state) {
            state.statusWorkareaRequest = 'pending';
        },
        createWorkareaError(state) {
            state.statusWorkareaRequest = 'error';
        },
        deleteWorkareaSuccess(state, data) {
            state.statusWorkareaRequest = 'success';
            state.workareas = data;
        },
        deleteWorkareaPending(state) {
            state.statusWorkareaRequest = 'pending';
        },
        deleteWorkareaError(state) {
            state.statusWorkareaRequest = 'error';
        }
    },
    actions: {
        workareasCreate({commit}, data) {
            commit('createWorkareaPending');
            return axios.post(apiHost + '/rest/workareas/create.php', data)
                .then( (response => response.data))
                .then( (response ) => {
                    commit('createWorkareaSuccess', response);
                })
                .catch ( () => {
                    commit('createWorkareaError');
                })
        },
        workareaDelete({commit}, data) {
            commit('deleteWorkareaPending');
            let toDelete = {idWorkarea : data};
            return axios.post(apiHost + '/rest/workareas/delete.php', toDelete )
                .then ( (response) => response.data )
                .then ( (response) => {
                    commit('deleteWorkareaSuccess', response);
                })
                .catch( () => {
                    commit('deleteWorkareaError');
                })


        },
        workareasFetch({commit}) {
            commit('fetchWorkareasPending');
            return axios.get(apiHost + '/rest/workareas/read.php')
                .then( (response) => response.data )
                .then( (response) => {
                    commit('fetchWorkareasSuccess', response)
                })
                .catch( ( ) => {
                    commit('fetchWorkareasError');
                })
        },
        workareasUpdate({commit}, data) {
            commit('updateWorkareasPending');
            return axios.post(apiHost + '/rest/workareas/update.php', data)
                .then( (response) => response.data)
                .then( (response) => {
                    if ( response !== 'ok') throw 'Error';
                    commit('updateWorkareasSuccess');
                })
                .catch( () => {
                    commit('updateWorkareasError');
                })
        }
    }
}