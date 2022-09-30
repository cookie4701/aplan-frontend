<template>

	<div class="container-fluid" v-if='userinfo' >
		<div class="row">
			<div class="col-sm-12" v-if="uname != ''">{{uname}}</div>
			<div class="col-sm-12" v-else>{{singleuserird}}</div>
		</div>

		<div class="row">
			<div class="col-sm-12">Neuen Berechnungszeitraum einfügen</div>
		</div>

		<div class="row">
			<div class="col-sm-1">
				Startdatum
			</div>

			<div class="col-sm-2">
				<input v-bind="">
			</div>

			<div class="col-sm-1">
				Enddatum
			</div>

			<div class="col-sm-2">
				<input v-bind="">
			</div>

			<div class="col-sm-2">
				<button @click="new_calc_interval" class="form-control btn btn-primary">Anlegen</button>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-3">Label</div>
			<div class="col-sm-3">Start</div>
			<div class="col-sm-3">Ende</div>
			<div class="col-sm-3">Vorgabe</div>
		</div>

		<div class="row" v-for="itm in items">
			<div class="col-sm-3"><input type="text" v-model='itm.label' > </div>
			<div class="col-sm-3"><input type="text" v-model='itm.startdate' > </div>
			<div class="col-sm-3"><input type="text" v-model='itm.enddate' > </div>
			<div class="col-sm-3"><input type="text" v-model='itm.startvalue' > </div>
			
		</div>

	</div>

</template>

<script>
import apiHost from '../config'
import postData from '../helper'

export default {
	props: ['userid'],
	data: [
		'startvalues' : [],
		'userinfo' : null
	],
	mounted() {
		fetch(apiHost + '/rest/userinfo/read.php', {'userid' : this.userid}

		fetch(apiHost + '/rest/startvalues/read.php', { 'userid' : this.userid})
		.then( res => this.startvalues = res )
		.catch( err => console.log(err) );

	}
}
</script>

