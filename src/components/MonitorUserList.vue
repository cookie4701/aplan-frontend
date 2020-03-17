<template>
    <div>
        <MonitorListEntry class="m-2" v-for="(datarow, index) in userdata" v-bind:key="datarow.id" :userinfo="datarow" :row-number="index"></MonitorListEntry>
    </div>
</template>

<script>
    import axios from 'axios';
    import {apiHost} from "../config";
    import MonitorListEntry from "./MonitorListEntry";

    export default {
        name: "MonitorUserList",
        components: {MonitorListEntry},
        data : function() {
            return {
                userdata : [],
                messages : ''
            }
        },
        methods : {
            onLoad() {
                // retrieve something
                axios.get( apiHost + '/rest/moderation/users/list.php?orgacode=jbuero2020')
                    .then( data => data.data)
                .then( (data) => {
                    this.userdata = data;
                })
                .catch( (err) => {
                    this.messages = err;
                })
            }
        },

        mounted() {
            this.onLoad();
        }
    }
</script>

<style scoped>

</style>