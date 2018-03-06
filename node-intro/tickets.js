const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let tickets = [];
let id = 0;

app.get('/api/tickets', (req, res) => {
  res.send(tickets);
});

app.post('/api/tickets', (req, res) => {
  id = id + 1;
  let ticket = {id:id, name:req.body.name, problem: req.body.problem};
  tickets.push(ticket);
  res.send(ticket);
});

app.delete('/api/tickets/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = tickets.map(ticket => { return ticket.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that ticket doesn't exist");
    return;
  }
  tickets.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))
