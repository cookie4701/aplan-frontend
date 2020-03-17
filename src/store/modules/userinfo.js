import axios from "axios";
import {apiHost} from "../../config";

export default {
    state: {
        statusUserinfo: 'not loaded',
        userinfo: {"userid": "-1", "username": "Not loaded yet"}
    },
    getters: {},
    setters: {},
    mutations: {
        userinfo_loading(state) {
            state.statusUserinfo = 'loading';
            state.userinfo = {"username": "foo"};
        },

        userinfo_loaded(state, userinfo) {
            state.statusUserinfo = 'loaded';
            state.userinfo = userinfo;
            const day = userinfo.startdate.substr(8, 2);
            const month = userinfo.startdate.substr(5, 2);
            const year = userinfo.startdate.substr(0, 4);

            const strDate = day + '.' + month + '.' + year;
            state.userinfo.startdate = strDate;

        },
        userinfo_error(state) {
            state.statusUserinfo = 'error';
            state.userinfo = {"username": "not loaded"};
        }
    },
    actions: {
        userdataFromServer({commit}) {
            axios
                .get(apiHost + '/rest/userdata/read.php')
                .then(r => r.data)
                .then(userinfo => {
                    commit('userinfo_loaded', userinfo)
                })

                .catch(() => {
                    commit('userinfo_error');
                })

        },
        userdataToServer({commit}) {
            // fake function until now
            commit('userinfo_updated');
        }
    }
}