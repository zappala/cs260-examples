<template>
  <div>
    <select v-model="monthText" name="month">
	<option value="0">January</option>
	<option value="1">February</option>
	<option value="2">March</option>
	<option value="3">April</option>
	<option value="4">May</option>
	<option value="5">June</option>
	<option value="6">July</option>
	<option value="7">August</option>
	<option value="8">September</option>
	<option value="9">October</option>
	<option value="10">November</option>
	<option value="11">December</option>
    </select>
    <input
    <div class="graph">
      <bar-chart v-if="chartData" :chart-data="chartData" :options="options" />
    </div>
  </div>
</template>

<script>
 import axios from 'axios';
 import BarChart from './BarChart.js';
 export default {
   components: {BarChart},
   name: 'Graph',
   data () {
     return {
       items: [],
       monthText: '1',
       options: {
	 responsive: true,
	 maintainAspectRatio: true,
	 scales: {
	   yAxes: [{
	     barPercentage:0.5,
	   }],
	 }
       },
     }
   },
   created: function() {
     this.getItems();
   },
   computed: {
     month: function() {
       return parseInt(this.monthText);
     },
     chartData: function() {
       let labels = [];
       let data = [];
       // sort by date
       this.items.sort(function(a,b) {
	 return b.completedDate - a.completedDate;
       });
       // setup data
       let completedCounts = {}
       for (let day = 1; day < 32; day++ ) {
	 completedCounts[day] = 0;
       }
       this.items.forEach(item => {
	 let day = new Date(item.completedDate).getDate();
	 let month = new Date(item.completedDate).getMonth();
	 console.log(month, this.month);
	 if (month === this.month && item.completed)
	   completedCounts[day] += 1;
       });
       for (let day in completedCounts) {
	 labels.push(day.toString());
	 data.push(completedCounts[day]);
       };
       return {
	 labels:labels,
	 datasets: [
	   {
	     label: 'Completed Tasks per Day',
	     backgroundColor: '#f87979',
	     data: data,
	   }
	 ]
       }
     },
   },
   methods: {
     getItems: function() {
       axios.get("/api/items").then(response => {
	 this.items = response.data;
	 return true;
       }).catch(err => {
       });
     },
     setMonth: function(event) {
       this.month = event;
       console.log(this.month);
     }
   }
 }
</script>

<style scoped>
 .graph {
     position: relative;
     width: 800px;
 }
</style>
