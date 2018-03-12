<template>
  <div class="graph">
    <bar-chart v-if="chartData" :chart-data="chartData" :options="options" />
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
       this.items.forEach(function(item) {
	 let day = new Date(item.completedDate).getDate();
	 if (item.completed)
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
   }
 }
</script>

<style scoped>
 .graph {
     position: relative;
     width: 800px;
 }
</style>
