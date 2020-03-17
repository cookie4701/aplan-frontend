import axios from "axios";
import {apiHost} from "../../config";
import {reaarrangeDateDbToBe, rearrangeDateBeToDb} from "../../helper";

export default {
    state: {
        statusVacationUserFetch : 'none',
        statusVacationUserDelete : 'none',
        statusVacationUserCreate : 'none',
        VacationUser : []
    },
    getters: {},
    setters: {},
    mutations: {
        fetchVacationUsersSuccess(status, data) {
            status.statusVacationUserFetch = 'success';
            for (let i = 0; i < data.length; i++) {
                data[i].startdate = reaarrangeDateDbToBe(data[i].startdate);
                data[i].enddate = reaarrangeDateDbToBe(data[i].enddate);
            }
            status.VacationUser = data;
        },
        fetchVacationUsersPending(status) {
            status.statusVacationUserFetch = 'pending';
        },
        fetchVacationUsersError(status) {
            status.statusVacationUserFetch = 'error';
        },
        createVacationUsersSuccess(status) {
            status.statusVacationUserCreate = 'success'
        },
        createVacationUsersPending(status) {
            status.statusVacationUserCreate = 'pending'
        },
        createVacationUsersError(status) {
            status.statusVacationUserCreate = 'error';
            status.VacationUser = [];
        },
        deleteVacationUsersSuccess(status) {
            status.statusVacationUserDelete = 'success'
        },
        deleteVacationUsersPending(status) {
            status.statusVacationUserDelete = 'pending'
        },
        deleteVacationUsersError(status) {
            status.statusVacationUserDelete = 'error';
            status.VacationUser = [];
        }
    },
    actions: {
        createVacations({commit}, data) {
            commit('createVacationUsersPending')
            data.startdate = rearrangeDateBeToDb(data.startdate);
            data.enddate = rearrangeDateBeToDb(data.enddate);

            return axios
                .post(apiHost + '/rest/vacation/create.php', data)
                .then (() => {
                    commit('createVacationUsersSuccess');
                })
                .catch( () => {
                    commit('createVacationUsersError')
                })
        },

        fetchVacations({commit}) {
            commit('fetchVacationUsersPending');
            return axios
                .get(apiHost + '/rest/vacation/read.php')
                .then( response => response.data)
                .then( resp => {
                    commit('fetchVacationUsersSuccess', resp);
                })
                .catch( () => {
                    commit('fetchVacationUsersError');
                })
        },

        deleteVacations({commit}, data) {
            commit('deleteVacationUsersPending');
            let toDelete = {idVacation : data};
            return axios
                .post(apiHost + '/rest/vacation/delete.php', toDelete)
                .then(() => {
                    commit('deleteVacationUsersSuccess');
                })
                .catch(() => {
                    commit('deleteVacationUsersError');
                })
        }
    }
}