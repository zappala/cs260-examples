// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];  
const db = require('knex')(config);

app.get('/api/tickets', (req, res) => {
  db('tickets').select().from('tickets').then(tickets => {
    res.send(tickets);
  }).catch(error => {
    res.status(500).json({ error });
  });
});

app.post('/api/tickets', (req, res) => {
  db('tickets').insert({name:req.body.name, problem: req.body.problem, priority: req.body.priority, created_at: new Date()}).then(ticket => {
    res.status(200).json({id:ticket[0]});
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

app.delete('/api/tickets/:id', (req, res) => {
  let id = parseInt(req.params.id);
  db('tickets').where('id',id).del().then(tickets => {
    res.sendStatus(200);    
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

app.listen(3000, () => console.log('Server listening on port 3000!'))
