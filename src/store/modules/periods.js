import axios from "axios";
import {apiHost} from "../../config";
import * as moment from 'moment';

export default {
    state: {
        statusPeriodsFetch : 'none',
        statusPeriodsDelete : 'none',
        statusPeriodsCreate : 'none',
        statusUserPeriodFetch : 'none',
        statusUserPeriodCreate : 'none',
        statusUserPeriodUpdate : 'none',
        periods : [],
        userperiod : []
    },
    getters: {},
    setters: {},
    mutations: {
        updateUserPeriodsPending(status) {
          status.statusUserPeriodUpdate = 'pending';
        },
        updateUserPeriodsError(status) {
          status.statusUserPeriodUpdate = 'error';
        },
        updateUserPeriodsSuccess(status, data) {
          status.statusUserPeriodUpdate = 'success';
          status.userperiod.splice(0, status.userperiod.length);
          for (let i=0; i < data.periods.length; i++ ) {
            data.periods[i].start = moment(data.periods[i].start, "YYYY-MM-DD").format("DD.MM.YYYY");
            data.periods[i].end = moment(data.periods[i].end, "YYYY-MM-DD").format("DD.MM.YYYY");

            if ( data.periods[i].minutes === null) {
              data.periods[i].minutes = 0;
            }
            status.userperiod.push(
              data.periods[i]
            );
          }
        },
        fetchUserPeriodSuccess(status, data) {
          status.statusUserPeriodFetch = 'success';
          status.userperiod.splice(0, status.userperiod.length);
          for (let i=0; i < data.periods.length; i++ ) {
            data.periods[i].start = moment(data.periods[i].start, "YYYY-MM-DD").format("DD.MM.YYYY");
            data.periods[i].end = moment(data.periods[i].end, "YYYY-MM-DD").format("DD.MM.YYYY");

            if ( data.periods[i].minutes === null) {
              data.periods[i].minutes = 0;
            }
            status.userperiod.push(
              data.periods[i]
            );
          }
        },
        fetchUserPeriodPending(status) {
          status.statusUserPeriodFetch = 'pending';
        },
        fetchUserPeriodError(status) {
          status.statusUserPeriodFetch = 'error';
          status.userperiod.splice(0, this.userperiod.length);
        },
        fetchPeriodsSuccess(status, data) {
            status.statusPeriodsFetch = 'success';

            for (let i = 0; i < data.length; i++) {
                data[i].startdate = moment(data[i].start, "YYYY-MM-DD").format("DD.MM.YYYY");
                data[i].enddate = moment(data[i].end, "YYYY-MM-DD").format("DD.MM.YYYY");
            }

            status.periods.splice(0, status.periods.length);
            for (let i = 0; i < data.length; i++) {
              status.periods.push(data[i]);
            }

        },
        fetchPeriodsPending(status) {
            status.statusPeriodsFetch = 'pending';
        },
        fetchPeriodsError(status) {
            status.statusPeriodsFetch = 'error';
        },
        createPeriodsSuccess(status, data) {
            status.statusPeriodsCreate = 'success';

            for (let i = 0; i < data.length; i++) {
                data[i].startdate = moment(data[i].start, "YYYY-MM-DD").format("DD.MM.YYYY");
                data[i].enddate = moment(data[i].end, "YYYY-MM-DD").format("DD.MM.YYYY");
            }

            status.periods.splice(0, status.periods.length);
            for (let i = 0; i < data.length; i++) {
              status.periods.push(data[i]);
            }

        },
        createPeriodsPending(status) {
            status.statusPeriodsCreate = 'pending'
        },
        createPeriodsError(status) {
            status.statusPeriodsCreate = 'error';
            status.periods.splice(0, status.periods.length);
        },
        deletePeriodsSuccess(status) {
            status.statusPeriodsDelete = 'success'
        },
        deletePeriodsPending(status) {
            status.statusPeriodsDelete = 'pending'
        },
        deletePeriodsError(status) {
            status.statusPeriodsDelete = 'error';
            //status.Periods = [];
        }
    },
    actions: {
        createPeriods({commit}, data) {
            commit('createPeriodsPending')
            let tmpDate = moment(data.startdate, "DD.MM.YYYY");
            if (! tmpDate.isValid() ) {
              return Promise.reject(new Error('startdate is not valid') );
            }

            data.startdate = tmpDate.format("YYYY-MM-DD");

            tmpDate = moment(data.enddate, "DD.MM.YYYY");
            if (! tmpDate.isValid() ) {
              return Promise.reject(new Error('enddate is not valid') );
            }

            data.enddate = tmpDate.format("YYYY-MM-DD");


            return axios
                .post(apiHost + '/rest/moderation/periods/create.php', data)
                .then( response => response.data )
                .then( data => data.periods )
                .then ((periods) => {
                    commit('createPeriodsSuccess', periods);
                })
                .catch( () => {
                    commit('createPeriodsError')
                })
        },

        fetchPeriods({commit}) {
            commit('fetchPeriodsPending');
            return axios
                .get(apiHost + '/rest/moderation/periods/read.php')
                .then( response => response.data)
                .then( data => {
                  if (data.status == undefined || data.status !== 200) {
                    if ( data.text !== undefined ) {
                      commit('fetchPeriodsError');
                    }

                    commit('fetchPeriodsError');

                  } else {
                    return data.periods;
                  }
                })
                .then( resp => {
                    commit('fetchPeriodsSuccess', resp);
                })
                .catch( () => {
                    commit('fetchPeriodsError');
                })
        },

        deletePeriod({commit}, data) {
            commit('deletePeriodsPending');
            let toDelete = {
                idPeriod : data
            };
            return axios
                .post(apiHost + '/rest/moderation/periods/delete.php', toDelete)
                .then(() => {
                    commit('deletePeriodsSuccess');
                })
                .catch(() => {
                    commit('deletePeriodsError');
                })
        },
        fetchUserPeriods({commit}, userid) {
          commit('fetchUserPeriodPending');
          return axios
            .get(apiHost + '/rest/moderation/periods/userperiods.php?userid=' + userid)
            .then( response => response.data )
            .then( data => {
              commit('fetchUserPeriodSuccess', data);
            })
            .catch(() => {
              commit('fetchUserPeriodError');
            });

        },
        updateUserPeriods({commit}, userdata) {
          commit('updateUserPeriodsPending');

          return axios
            .post(apiHost + '/rest/moderation/periods/userperiods.php', userdata)
            .then( response => response.data)
            .then( (data) => {
              if ( data.status === 200 ) {
                commit('updateUserPeriodsSuccess', data);
              } else {
                commit('updateUserPeriodsError');
              }
            })
        }
    }
}
