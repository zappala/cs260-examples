import {HorizontalBar, mixins} from 'vue-chartjs';
const { reactiveProp } = mixins

export default {
    extends: HorizontalBar,
    mixins: [reactiveProp],
    props: ['options'],
    mounted () {
	console.log("chartData",this.chartdata);
	this.renderChart(this.chartData, this.options)
    }
}
