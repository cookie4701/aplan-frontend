import axios from "axios";
import {apiHost} from "../../config";
import {convertStringToDate, reaarrangeDateDbToBe, rearrangeDateBeToDb, initializeStateWorkWeek} from "../../helper";

export default {
    state: initializeStateWorkWeek,
    mutations: {
        fetchWeekdataSuccess(state) {
            state.statusWeekData = 'success';

        },
        fetchWeekdataPending(state) {
            state.statusWeekData = 'pending';
        },
        fetchWeekDataInProgress(state, responseArray) {
            state.statusWeekData = 'pending';
            state.weekdata[responseArray.day] = responseArray.data;

        },
        fetchWeekdataError(state) {
            state.statusWeekData = 'error';
        },
        updateWeekDataSuccess(state) {
            state.statusWeekData = 'success';
        },
        updateWeekDataPending(state) {
            state.statusWeekData = 'pending';
        },
        updateWeekDataError(state) {
            state.statusWeekData = 'error';
        },
        createTimePairPending(state) {
            state.statusCreateTimePair = 'pending';
        },
        createTimePairError(state) {
            state.statusCreateTimePair = 'error';
        },
        createTimePairSuccess(state, data) {
            state.statusCreateTimePair = 'success';
            for (let i = 0; i < state.weekdata.length; i++) {
                if (data.workdayId === state.weekdata[i].id) {
                    // day found, append data to array
                    state.weekdata[i].worktime.push(data.payload);
                    //this.$set(state.weekdata[i].worktime, state.weekdata[i].worktime.length, data.payload );
                }

            }
        },
        deleteTimePairPending(state) {
            state.statusDeleteTimePair = 'pending';
        },
        deleteTimePairError(state) {
            state.statusDeleteTimePair = 'error';
        },
        deleteTimePairSuccess(state, data) {
            const idTimePair = data.id;

            state.statusDeleteTimePair = 'success';
            for (let i = 0; i < state.weekdata.length; i++) {
                for (let k = 0; k < state.weekdata[i].worktime.length; k++) {
                    if ( idTimePair === state.weekdata[i].worktime[k].id) {
                        state.weekdata[i].worktime.splice(k,1);
                    }
                }

            }

        },
        createDriveError(state) {
            state.statusCreateDrive = 'error';
        },
        createDrivePending(state) {
            state.statusCreateDrive = 'pending';
        },
        createDriveSuccess(state, data ) {
            state.statusCreateDrive = 'success';
            for (let i = 0; i < state.weekdata.length; i++) {
                if ( state.weekdata[i].id === data.workdayId ) {
                    state.weekdata[i].travel.push( data.payload );
                }
            }

        },
        deleteDrivePending(state) {
            state.statusDeleteDrive = 'pending';
        },
        deleteDriveError(state) {
            state.statusDeleteDrive = 'error';
        },
        deleteDriveSuccess(state, data) {
            for (let i=0; i < state.weekdata.length; i++ ) {
                for (let k = 0; k < state.weekdata[i].travel.length; k++) {
                    if (state.weekdata[i].travel[k].id === data.idDrive) {
                        state.weekdata[i].travel.splice(k, 1);
                        state.statusDeleteDrive = 'success';
                    }
                }
            }

            if (state.statusDeleteDrive !== 'success') {
                state.statusDeleteDrive = 'error: dataset not found';
            }
        },
        updateWorkdayError(state) {
            state.statusUpdateWorkday = 'error';
        },
        updateWorkdayPending(state) {
            state.statusUpdateWorkday = 'pending';
        },
        updateWorkdaySuccess(state) {
            state.statusUpdateWorkday = 'success';
        }


    },
    actions: {
        fetchWeekData({commit}, objToSend) {
            
            commit('fetchWeekdataPending');
            let queryDate = convertStringToDate(objToSend.startdate);

            let promises = [];
            for (let x = 0; x < objToSend.nbrDays; x++ ) {
                let objData = '';
                let day = 1;
                let month = 1;
                if ( queryDate.getDate() < 10) {
                    day = '0' + queryDate.getDate();
                } else {
                    day = queryDate.getDate();
                }

                if (queryDate.getMonth() + 1 < 10) {
                    month = '0' + (queryDate.getMonth()+1);
                } else {
                    month = (queryDate.getMonth()+1);
                }

                objData = {
                    startdate : queryDate.getFullYear() + '-' + month + '-' + day
                }

                //axios.defaults.headers.common['Authorization'] = localStorage.getItem('user-token').replace(/\n/g,'') || '';
                promises[x] = axios
                    .get(apiHost + '/rest/weekdata/read.php', { params : objData } )
                    .then( response => response.data)
                    .then( response => {

                        response['dateOfDay'] = reaarrangeDateDbToBe(response['dateOfDay']);

                        return commit('fetchWeekDataInProgress', {day : x, data : response});
                    })
                    .catch( (err) => {
                        // eslint-disable-next-line no-console
                        console.log('oops: ' + err);
                        

                    });

                queryDate.setDate(queryDate.getDate() + 1);

            }

            return Promise.all(promises)
                .then( () => {
                    commit('fetchWeekdataSuccess');
                })
                .then( () => {
                    return "ok";
                })
                .catch( () => {
                    commit('fetchWeekdataError');

                })


        },
        updateWeekData({commit}, data) {
            commit('updateWeekDataPending');
            for (let i = 0; i < data.length; i++ ) {
                data[i].dateOfDay = rearrangeDateBeToDb(data[i].dateOfDay);
            }
            return axios
                .post(apiHost + '/rest/weekdata/update.php', data)
                .then( () => {
                    for (let i = 0; i < data.length; i++ ) {
                        data[i].dateOfDay = reaarrangeDateDbToBe(data[i].dateOfDay);
                    }

                    commit('updateWeekDataSuccess');
                })
                .catch( () => {
                    commit('updateWeekDataError');
                })

        },

        updateWorkDay({commit}, workdayData) {
            commit('updateWorkdayPending');

            //workdayData.dateOfDay = rearrangeDateBeToDb(workdayData.dateOfDay);

            return axios
                .patch(
                    apiHost + '/rest/weekdata/update.php',
                    workdayData
                )

                .then( () => {
                    commit('updateWorkdaySuccess');
                })
                .catch( () => {
                    commit('updateWorkdayError')
                })
        },

        createTimePairToDayById({commit}, workdayId) {
            commit('createTimePairPending');

            const reqData = {
                workdayId : workdayId
            };

            return axios.post(apiHost + '/rest/timepair/create.php', reqData)

                .then( response => response.data )
                .then( (response) => {
                    const myData = {
                        workdayId : workdayId,
                        payload : response
                    }
                    commit('createTimePairSuccess', myData);
                })
                .catch( () => {
                    commit('createTimePairError');
                })
        },
        deleteTimePairById({commit}, timePairId) {
            commit('deleteTimePairPending');
            const reqData = {
                idToDelete: timePairId
            };
            return axios.post(
                apiHost + '/rest/timepair/delete.php', reqData
            )

                .then( () => {
                    const dataToRemove = {
                        id : timePairId
                    };
                    commit('deleteTimePairSuccess', dataToRemove);
                })

                .catch( () => {
                    commit('deleteTimePairError');
                })
        },
        deleteDrive({commit}, driveId) {
            commit('deleteDrivePending');
            const reqData = {
                driveId : driveId
            };

            return axios.post(
                apiHost + '/rest/drivepair/delete.php',
                reqData
            )
                .then( (response) => response.data)
                .then( (response) => {
                    const data = {
                        payload : response,
                        idDrive : driveId
                    };

                    commit('deleteDriveSuccess', data);
                })

                .catch( () => {
                    commit('deleteDriveError');
                })
        },
        createDrive({commit}, workdayid) {
            commit('createDrivePending');

            const reqData = {
                workdayId : workdayid
            };

            return axios.post(
                apiHost + '/rest/drivepair/create.php',
                reqData
            )
                .then( response => response.data )
                .then( (response) => {
                    const data = {
                        workdayId : workdayid,
                        payload: response
                    };
                    commit('createDriveSuccess', data);

                })
                .catch( () => {
                    commit('createDriveError');
                })
        }


    }
}
