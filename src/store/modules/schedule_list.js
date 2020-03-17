import axios from "axios";
import {apiHost} from "../../config";
import {rearrangeDateBeToDb, reaarrangeDateDbToBe} from "../../helper";

export default {
    state: {
        scheduleStatus: 'not loaded',
        scheduleListItems: [],

        statusScheduleNew: 'open',
        scheduleNew: {schedulename: '', scheduleStart: '', scheduleEnd: ''},
        statusScheduleUpdate: 'none',

    },
    getters: {},
    setters: {},
    mutations: {
        scheduledata_loading(state) {
            state.scheduleStatus = 'loading';
            state.scheduleListItems = [];
        },

        scheduledata_loaded(state, scheduledata) {
            state.scheduleStatus = 'loaded';
            state.scheduleListItems = scheduledata;
        },
        scheduledata_error(state) {
            state.scheduleStatus = 'not loaded - error';
            state.scheduleListItems = [];
        },
        scheduledataAddSuccess(state) {
            state.statusScheduleNew = 'added';
        },
        scheduledataAddError(state) {
            state.statusScheduleNew = 'open';
        },
        scheduledataAddPending(state) {
            state.statusScheduleNew = 'pending';
        },
        scheduledataUpdatePending(state) {
            state.statusScheduleUpdate = 'pending';
        },
        scheduledataUpdateSuccess(state) {
            state.statusScheduleUpdate = 'success';
        },
        scheduledataUpdateError(state) {
            state.statusScheduleUpdate = 'error on update';
        }
    },
    actions: {
        scheduleDataFromServer({commit}) {
            commit('scheduledata_loading');
            axios
                .get(apiHost + '/rest/schedule/read.php')
                .then(r => r.data)
                .then(scheduledata => {
                    for (var i=0; i< scheduledata.length; i++) {
                        scheduledata[i].startdate = reaarrangeDateDbToBe(scheduledata[i].startdate);
                        scheduledata[i].enddate = reaarrangeDateDbToBe(scheduledata[i].enddate);
                    }
                    commit('scheduledata_loaded', scheduledata);
                })
                .catch(() => {
                    commit('scheduledata_error');
                })
        },
        scheduleDataNewToServer({commit}, snew) {
            commit('scheduledataAddPending');

            axios
                .post(apiHost + '/rest/schedule/create.php', snew)
                .then(() => {
                    commit('scheduledataAddSuccess');
                })
                .then(() => {
                    this.scheduleDataFromServer();
                })
                .catch(() => {
                    commit('scheduledataAddError');
                })
        },
        scheduleDataUpdateToServer({commit}, data) {
            commit('scheduledataUpdatePending');
            data.startdate = rearrangeDateBeToDb(data.startdate);
            data.enddate = rearrangeDateBeToDb(data.enddate);
            axios
                .post(apiHost + '/rest/schedule/update.php', data)

                .then(() => {
                    commit('scheduledataUpdateSuccess');
                })

                .catch(() => {
                    commit('scheduledataUpdateError');
                })
        }
    }
}