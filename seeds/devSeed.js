
const fs = require("fs");

exports.seed = async function (knex) {
  // Loading database "Film"
  const filmContents = fs.readFileSync("./data/tempData.json");
  const films = JSON.parse(filmContents);
  const processedFilms = films.map((film) => {
    return (({
      backdropPath,
      title,
      id,
      slug,
      overview,
      logLine,
      posterPath,
      releaseDate,
      term,
      video,
      vimeoId,
      duration,
      approved
    }) => ({
      backdropPath,
      title,
      id,
      slug,
      overview,
      logLine,
      posterPath,
      releaseDate,
      term,
      video,
      vimeoId,
      duration,
      approved
    }))(film);
  });

  await knex("Film").del();
  await knex.batchInsert("Film", processedFilms, 100);

  // Loading database "Course", "Directors"
  const courseContents = fs.readFileSync("./data/courses.json");
  const courses = JSON.parse(courseContents);
  await knex("Course").del();
  await knex.batchInsert("Course", courses, 100);

  const directorContents = fs.readFileSync("./data/tempDirectors.json");
  const directors = JSON.parse(directorContents);
  await knex("Directors").del();
  await knex.batchInsert("Directors", directors, 100);

  // Loading databse "Genre", "Actors", "Contributors", "CourseFilm"(affiliation), "DirectorFilm"(affiliation)
  const genreMap = [];
  const actorsMap = [];
  const contributorsMap = [];
  const courseMap = [];
  const directorsMap = [];
  const posterMap = [];
  const backdropMap = [];

  films.forEach((film) => {
    film.genre.forEach((genre) => {
      genreMap.push({ filmId: film.id, genreName: genre, approved: film.approved });
    });
    film.actors.forEach((name) => {
      actorsMap.push({ filmId: film.id, actorName: name });
    });
    film.contributors.forEach((name) => {
      contributorsMap.push({ filmId: film.id, contributorName: name });
    });
    film.course.forEach((courseName) => {
      courseMap.push({ filmId: film.id, courseFilmName: courseName });
    });
    film.directorIds.forEach((id) => {
      directorsMap.push({ filmId: film.id, directorId: id });
    });
    posterMap.push({ filmSlug: film.slug, posterData: `data:image/jpg;base64,${fs.readFileSync("./public" + film.posterPath, { encoding: 'base64' })}` });
    backdropMap.push({ filmSlug: film.slug, backdropData: `data:image/jpg;base64,${fs.readFileSync("./public" + film.backdropPath, { encoding: 'base64' })}` });
  });

  await knex("Genre").del();
  await knex.batchInsert("Genre", genreMap, 100);

  await knex("Actors").del();
  await knex.batchInsert("Actors", actorsMap, 100);

  await knex("Contributors").del();
  await knex.batchInsert("Contributors", contributorsMap, 100);

  await knex("CourseFilm").del();
  await knex.batchInsert("CourseFilm", courseMap, 100);

  await knex("DirectorsFilm").del();
  await knex.batchInsert("DirectorsFilm", directorsMap, 100);

  await knex("Poster").del();
  await knex.batchInsert("Poster", posterMap, 100);

  await knex("Backdrop").del();
  await knex.batchInsert("Backdrop", backdropMap, 100);

  await knex("Admins").del();
  await knex("Admins").insert([{ adminUserName: "jiaqil", adminMiddEmail: "jiaqil@middlebury.edu"}]);
};