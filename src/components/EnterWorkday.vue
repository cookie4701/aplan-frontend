<template>
	<div :style="myStyle">
		{{workdaydata.id}}

	</div>
</template>

<script setup>

import {
	timeToMinutes,
	minutesToTime,
	getDaynameFromDate
	} from "../helper";
</script>

<script>
export default {
	name: "EnterWorkday",
	data() {
		return {
			myStyle : { backgroundColor: "white" },
			inputStyle : {},
			remainingTime : ''
		}
	},
	props: ['workdaydata']
};

</script>

<style scoped>

.customWidth {}

.description-workarea {
	width: 14ch;
}

.cardestination {
	width: 10ch;
}

</style>
