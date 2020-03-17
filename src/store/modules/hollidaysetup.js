import axios from "axios";
import {apiHost} from "../../config";
import {reaarrangeDateDbToBe, rearrangeDateBeToDb} from "../../helper";

export default {
    state: {
        statusHollidayUserFetch : 'none',
        statusHollidayUserDelete : 'none',
        statusHollidayUserCreate : 'none',
        hollidayUser : []
    },
    getters: {},
    setters: {},
    mutations: {
        fetchHollidayUsersSuccess(status, data) {
            status.statusHollidayUserFetch = 'success';
            for (let i = 0; i < data.length; i++) {
                data[i].startdate = reaarrangeDateDbToBe(data[i].startdate);
                data[i].enddate = reaarrangeDateDbToBe(data[i].enddate);
            }
            status.hollidayUser = data;
        },
        fetchHollidayUsersPending(status) {
            status.statusHollidayUserFetch = 'pending';
        },
        fetchHollidayUsersError(status) {
            status.statusHollidayUserFetch = 'error';
        },
        createHollidayUsersSuccess(status) {
            status.statusHollidayUserCreate = 'success'
        },
        createHollidayUsersPending(status) {
            status.statusHollidayUserCreate = 'pending'
        },
        createHollidayUsersError(status) {
            status.statusHollidayUserCreate = 'error';
            status.hollidayUser = [];
        },
        deleteHollidayUsersSuccess(status) {
            status.statusHollidayUserDelete = 'success'
        },
        deleteHollidayUsersPending(status) {
            status.statusHollidayUserDelete = 'pending'
        },
        deleteHollidayUsersError(status) {
            status.statusHollidayUserDelete = 'error';
            status.hollidayUser = [];
        }
    },
    actions: {
        createHollidays({commit}, data) {
            commit('createHollidayUsersPending')
            data.startdate = rearrangeDateBeToDb(data.startdate);
            data.enddate = rearrangeDateBeToDb(data.enddate);
            return axios
                .post(apiHost + '/rest/hollidays/create.php', data)
                .then (() => {
                    commit('createHollidayUsersSuccess');
                })
                .catch( () => {
                    commit('createHollidayUsersError')
                })
        },

        fetchHollidays({commit}) {
            commit('fetchHollidayUsersPending');
            return axios
                .get(apiHost + '/rest/hollidays/read.php')
                .then( response => response.data)
                .then( resp => {
                    commit('fetchHollidayUsersSuccess', resp);
                })
                .catch( () => {
                    commit('fetchHollidayUsersError');
                })
        },

        deleteHollidays({commit}, data) {
            commit('deleteHollidayUsersPending');
            let toDelete = {
                idHolliday : data
            };
            return axios
                .post(apiHost + '/rest/hollidays/delete.php', toDelete)
                .then(() => {
                    commit('deleteHollidayUsersSuccess');
                })
                .catch(() => {
                    commit('deleteHollidayUsersError');
                })
        }
    }
}
