import axios from "axios";
import {apiHost} from "../../config";
import {reaarrangeDateDbToBe, rearrangeDateBeToDb} from "../../helper";

export default {
    state: {
        statusDriveCompensationsFetch : 'none',
        statusDriveCompensationsUpdate : 'none',
        statusDriveCompensationsCreate : 'none',
        statusDriveCompensationsDelete : 'none',
        driveCompensations : []
    },
    getters: {},
    setters: {},
    mutations: {
        driveCompensationsFetchSuccess(state, data) {
            state.driveCompensations = data;
            state.statusDriveCompensationsFetch = 'success';
        },
        driveCompensationsFetchPending(state) {
            state.statusDriveCompensationsFetch = 'pending';
        },
        driveCompensationsFetchError(state) {
            state.statusDriveCompensationsFetch = 'error';
        },
        driveCompensationsUpdatePending(state) {
            state.statusDriveCompensationsUpdate = 'pending';
        },
        driveCompensationsUpdateSuccess(state) {
            state.statusDriveCompensationsUpdate = 'success';
        },
        driveCompensationsUpdateError(state) {
            state.statusDriveCompensationsUpdate = 'error';
        },
        driveCompensationsCreatePending(state) {
            state.statusDriveCompensationsCreate = 'pending';
        },
        driveCompensationsCreateSuccess(state) {
            state.statusDriveCompensationsCreate = 'success';
        },
        driveCompensationsCreateError(state) {
            state.statusDriveCompensationsCreate = 'error';
        },
        driveCompensationsDeletePending(state) {
            state.statusDriveCompensationsDelete = 'pending';
        },
        driveCompensationsDeleteSuccess(state) {
            state.statusDriveCompensationsDelete = 'success';
        },
        driveCompensationsDeleteError(state) {
            state.statusDriveCompensationsDelete = 'error';
        }
    },
    actions: {
        insertDriveCompensation({commit}, data) {
            commit('driveCompensationsCreatePending');
            data.startdate = rearrangeDateBeToDb(data.startdate);
            data.enddate = rearrangeDateBeToDb(data.enddate);
            data.val = data.val.replace(",", ".");
            return axios.post(
                apiHost + '/rest/drive_compensation/create.php', data
            )
                .then ( (resp)=> resp.data )
                .then( (response) => {
                    commit('driveCompensationsCreateSuccess');
                    return response;
                })
                .then ( () => {
                    data.startdate = reaarrangeDateDbToBe(data.startdate);
                    data.enddate = reaarrangeDateDbToBe(data.enddate);
                    data.val = data.val.replace(".", ",");
                })
                .catch( (err) => {
                    commit('driveCompensationsCreateError')
                    return err;
                })
        },

        fetchDriveCompensation({commit}) {
            commit('driveCompensationsFetchPending');

            return axios.get(
                apiHost + '/rest/drive_compensation/read.php'
            )
                .then( resp => resp.data )
                .then( (data) => {
                    if (data === 'not ok') {
                        throw 'Unable to fetch';
                    }

                    for (let i = 0; i < data.length; i++) {
                        data[i].startdate = reaarrangeDateDbToBe(data[i].startdate);
                        data[i].enddate = reaarrangeDateDbToBe(data[i].enddate);
                        //data[i].val = data[i].val.replace(".", ",");
                    }

                    return data;
                })
                .then ( data => {

                    commit('driveCompensationsFetchSuccess', data);

                })

                .catch( (err) => {

                    // eslint-disable-next-line no-console
                    console.log(err);
                    return err;
                })

        },

        deleteDriveCompensation({commit}, toDelete) {
            commit('driveCompensationsDeletePending');
            return axios.post(
                apiHost + '/rest/drive_compensation/delete.php',
                toDelete
            )
                .then ( () => {
                    commit('driveCompensationsDeleteSuccess');
                })

                .catch( (err) => {
                    commit('driveCompensationsDeleteError');
                    return err;
                })
        }
    }
}