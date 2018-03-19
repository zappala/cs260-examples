var app = new Vue({
  el: '#app',
  data: {
    addedName: '',
    addedProblem: '',
    addedPriority: '',
    tickets: [],
  },
  created: function() {
    this.getTickets();
  },
  filters: {
    dateFormat: function(ticket) {
      let month = new Array();
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      let date = new Date(ticket.created_at);
      let monthName = month[date.getMonth()];
      return `${date.getDate()} ${monthName} ${date.getFullYear()}`
    },
    priorityName: function(priority) {
      let name = new Array();
      name[0] = "High";
      name[1] = "Medium";
      name[2] = "Low";
      return name[priority];
    }
  },
  methods: {
    getTickets: function() {
      axios.get("http://localhost:3000/api/tickets").then(response => {
	this.tickets = response.data;
	return true;
      }).catch(err => {
      });
    },
    addTicket: function() {
      axios.post("http://localhost:3000/api/tickets", {
	name: this.addedName,
	problem: this.addedProblem,
	priority: this.addedPriority
      }).then(response => {
	this.addedName = "";
	this.addedProblem = "";
	this.addedPriority = "";
	this.getTickets();
	return true;
      }).catch(err => {
      });
    },
    deleteTicket: function(ticket) {
      axios.delete("http://localhost:3000/api/tickets/" + ticket.id).then(response => {
	this.getTickets();
	return true;
      }).catch(err => {
      });
    },
  }
});
