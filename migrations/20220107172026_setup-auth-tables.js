exports.up = function(knex) {
    return knex.schema.createTable("accounts", table=>{
      table.increments("id").primary();
      table.string("compound_id", 255).notNullable();
      table.integer("user_id").notNullable();
      table.string("provider_type", 255).notNullable();
      table.string("provider_id", 255).notNullable();
      table.string("provider_account_id", 255).notNullable();
      table.text("refresh_token");
      table.text("access_token");
      table.timestamp("access_token_expires");
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  
      table.unique("compound_id");
      table.index("provider_account_id");
      table.index("provider_id");
      table.index("user_id");
    })
    .createTable("sessions", table=>{
      table.increments("id").primary();
      table.integer("user_id").notNullable();
      table.timestamp("expires").notNullable();
      table.string("session_token", 255).notNullable();
      table.string("access_token", 255).notNullable();
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  
      table.unique("session_token");
      table.index("access_token");
    })
    .createTable("users", table=>{
      table.increments("id").primary();
      table.string("name", 255);
      table.string("email", 255);
      table.timestamp("email_verified");
      table.string("image", 255);
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  
      table.unique("email");
    })
    .createTable("verification_requests", table=>{
      table.increments("id").primary();
      table.string("identifier", 255).notNullable();
      table.string("token", 255).notNullable();
      table.timestamp("expires").notNullable();
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('accounts')
    .dropTableIfExists('sessions')
    .dropTableIfExists('users')
    .dropTableIfExists('verification_requests');
}