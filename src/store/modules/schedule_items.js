import axios from "axios";
import {apiHost} from "../../config";
import {getStringDayOfWeek} from "../../helper";

export default {
    state: {
        statusScheduleItemsFetch: 'none',
        scheduleItems: [],
        statusScheduleItemDataNew: 'none',
        statusScheduleItemDelete : 'none',

    },
    getters: {
        statusRestScheduleItemsFetch() {
            return this.statusScheduleItemsFetch;
        },
        statusRestScheduleItemDataNew(state) {
            return state.statusScheduleItemDataNew;
        }
    },
    setters: {},
    mutations: {
        scheduleItemsFetchPending(state) {
            state.statusScheduleItemsFetch = 'pending';
            state.scheduleItems = [];
        },
        scheduleItemsFetchSuccess(state, data) {
            state.statusScheduleItemsFetch = 'success';
            state.scheduleItems = data;

        },
        scheduleItemsFetchError(state) {
            state.statusScheduleItemsFetch = 'error';
            state.scheduleItems = [];
        },

        scheduleItemToServerPending(state) {
            state.statusScheduleItemDataNew = 'pending';
        },

        scheduleItemToServerSuccess(state) {
            state.statusScheduleItemDataNew = 'success';
        },

        scheduleItemToServerError(state) {
            state.statusScheduleItemDataNew = 'error';
        },
        scheduleItemDeleteSuccess(state) {
            state.statusScheduleItemDelete = 'success';
        },
        scheduleItemDeletePending(state) {
            state.statusScheduleItemDelete = 'pending';
        },
        scheduleItemDeleteError(state) {
            state.statusScheduleItemDelete = 'error';
        }
    },
    actions: {
        scheduleItemsFetchFromServer({commit}, idSchedule) {
            commit('scheduleItemsFetchPending');
            axios
                .post(apiHost + '/rest/schedule_items/read.php', {"idSchedule": idSchedule})

                .then(r => r.data)
                .then( r => {
                    for (let i = 0; i <r.length; i++ ) {
                        r[i]['dayname'] = getStringDayOfWeek(r[i]['dayOfWeek']);
                    }
                    return r;
                })
                .then((responseData) => {
                    commit('scheduleItemsFetchSuccess', responseData);
                })
                .catch(() => {
                    commit('scheduleItemsFetchError');
                })
        },
        scheduleItemsToServer({commit}, itm) {
            commit('scheduleItemToServerPending');
            return axios
                .post(apiHost + '/rest/schedule_items/create.php', itm)
                .then(() => {
                    commit('scheduleItemToServerSuccess');
                })

                .catch(() => {
                    commit('scheduleItemToServerError');
                })
        },
        scheduleItemDeleteFromServer({commit}, id) {
            commit('scheduleItemDeletePending');
            let datasetDelete = { idScheduleItem : id };
            axios
                .post(apiHost + '/rest/schedule_items/delete.php', datasetDelete)
                .then( () => {
                    commit('scheduleItemDeleteSuccess');
                })
                .catch( () => {
                    commit('scheduleItemDeleteError');
                });
        }
    }
}