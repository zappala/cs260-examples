exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tickets', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('problem');
      table.date('created_at');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tickets'),
  ]);
};
