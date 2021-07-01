<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12">
                Überstunden Statistik aller Nutzer anzeigen
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12">
                Hier kommt die Datenauswahl hin mit Button.
            </div>
        </div>

        <div class="row">
            <div id="zielbereich">
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {apiHost} from "../config";


export default {
    name : 'MonitorStatsAll',
    data : {
        return {
            'var' : 'val',
            'userdata' : []
        }
    },
    methods : {
        gatherDataControl() {

        },
        gatherUserList() {

        },
        gatherUserDetailData() {
            
        }
    }
}
</script>


