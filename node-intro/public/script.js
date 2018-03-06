var app = new Vue({
  el: '#app',
  data: {
    addedName: '',
    addedProblem: '',
    tickets: {},
  },
  created: function() {
    this.getTickets();
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
	problem: this.addedProblem
      }).then(response => {
	this.addedName = "";
	this.addedProblem = "";
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
    }
  }
});
