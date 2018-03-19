exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('tickets', function(table) {
      table.integer('priority').defaultTo(0);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('tickets', function(table) {
      table.dropColumn('priority');
    }),
  ]);
};

