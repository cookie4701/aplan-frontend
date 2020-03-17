import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {apiHost} from '../config'

import auth from './modules/auth';
import userinfo from "./modules/userinfo";
import schedule_list from "./modules/schedule_list";
import schedule_items from "./modules/schedule_items";
import drive_compensation from "./modules/drive_compensation";
import hollidaysetup from "./modules/hollidaysetup";
import vacationsetup from "./modules/vacationsetup";
import workareas from "./modules/workareas";
import weekdata from "./modules/weekdata";

Vue.use(Vuex)
Vue.use(VueAxios, axios)

export default new Vuex.Store({
    modules : {
        auth,
        userinfo,
        schedule_list,
        schedule_items,
        drive_compensation,
        hollidaysetup,
        vacationsetup,
        workareas,
        weekdata
    },
    state: {

        /*
        statusWorkdata: 'not loaded',
        workdata: [
            {"dayId": "-1", "dateOfDay": "2019-01-01"},
            {"dayId": "-1", "dateOfDay": "2019-01-01"}],

         */
    },
    mutations: {
/*
        workdata_loading(state) {
            state.statusWorkdata = 'loading';
        },
        workdata_loaded(state, workdata) {
            state.statusWorkdata = 'loaded';
            state.workdata = workdata;
        },
        workdata_error(state) {
            state.statusWorkdata = 'error';
        },

 */



        

    },
    actions: {


        driveCompensationsFetchFromServer({commit}) {
            commit('driveCompensationsFetchPending');
            axios
                .get(apiHost + '/rest/drive_compensation/read.php')
                .then ( data => {
                    commit('driveCompensationFetchSuccess', data);
                })
                .then( () => {
                    commit('driveCompensationFetchError');
                });
        },
        driveCompensationsUpdateToServer({commit}, data) {
            commit('driveCompensationsUpdatePending');
            axios
                .post(apiHost + '/rest/drive_compensation/update.php', data)
                .then( () => {
                    commit('driveCompensationUpdateSuccess');
                })
                .catch( () => {
                    commit('driveCompensationUpdateError');
                });

        },
        driveCompensationsCreateToServer({commit}) {
            commit('driveCompensationsCreatePending');
        },
        driveCompensationsDeleteFromServer({commit}, id) {
            commit('driveCompensationsDeletePending');
            let toDelete = {idDrive : id};
            axios
                .post(apiHost + '/rest/drive_compensation/delete.php', toDelete)
                .then( () => {
                    commit('driveCompensationDeleteSuccess');
                })
                .catch ( () => {
                    commit('driveCompensationDeleteError');
                });
        },

    },
    getters: {

    }
})
