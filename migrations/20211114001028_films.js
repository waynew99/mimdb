
exports.up = function(knex) {
  return knex.schema.createTable("Film", table => {
    table.string("backdropPath");
    table.string("title").unique().notNullable();
    table.increments("id");
    table.string("slug").unique().notNullable();
    table.text("overview");
    table.string("logLine");
    table.string("posterPath");
    table.string("term");
    table.string("releaseDate");
    table.boolean("video");
    table.string("vimeoId");
    table.string("duration").notNullable();
    table.boolean("approved").notNullable().defaultTo(false);
  })
  .createTable("Genre", table => {
    table.integer("filmId");
    table.string("genreName");
    table.boolean("approved").notNullable().defaultTo(false);
    table.foreign("filmId").references("Film.id").onDelete("CASCADE");
  })
  .createTable("Actors", table => {
    table.integer("filmId");
    table.string("actorName");
    table.foreign("filmId").references("Film.id").onDelete("CASCADE");
  })
  .createTable("Contributors", table => {
    table.integer("filmId");
    table.string("contributorName");
    table.foreign("filmId").references("Film.id").onDelete("CASCADE");
  })
  .createTable("Course", table => {
    table.string("courseName").unique().notNullable();
    table.string("courseNumber").unique().notNullable();
    table.integer("approvedFilmCount").defaultTo(0);
    table.text("courseDescription");
  })
  .createTable("Directors", table => {
    table.string("directorName");
    table.increments("directorId").unique().notNullable();
    table.string("directorSlug").unique();
    table.string("directorBio");
    table.string("directorMiddEmail");
    table.string("directorPersonalEmail");
    table.string("directorClassYear");
    table.boolean("directorMiddEmailIsPrivate");
    table.boolean("directorPersonalEmailIsPrivate");
  })
  .createTable("CourseFilm", table => {
    // Affiliation table for Course and Film, two foreign keys
    table.integer("filmId");
    table.string("courseFilmName");
    table.foreign("filmId").references("Film.id").onDelete("CASCADE");
    table.foreign("courseFilmName").references("Course.courseName").onDelete("CASCADE");
  })
  .createTable("DirectorsFilm", table => {
    // Affiliation table for Directors and Film, two foreign keys
    table.integer("filmId");
    table.integer("directorId");
    table.foreign("filmId").references("Film.id").onDelete("CASCADE");
    table.foreign("directorId").references("Directors.directorId").onDelete("CASCADE");
  })
  .createTable("Poster", table => {
    table.string("filmSlug").unique().notNullable();
    table.text("posterData").notNullable();  //base64 string
    table.foreign("filmSlug").references("Film.slug").onDelete("CASCADE");
  })
  .createTable("Backdrop", table => {
    table.string("filmSlug").unique().notNullable();
    table.text("backdropData").notNullable();  //base64 string
    table.foreign("filmSlug").references("Film.slug").onDelete("CASCADE");
  })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Film")
                    .dropTableIfExists("Genre")
                    .dropTableIfExists("Actors")
                    .dropTableIfExists("Contributors")
                    .dropTableIfExists("Course")
                    .dropTableIfExists("Directors")
                    .dropTableIfExists("CourseFilm")
                    .dropTableIfExists("DirectorsFilm")
                    .dropTableIfExists("Poster")
                    .dropTableIfExists("Backdrop");
};
