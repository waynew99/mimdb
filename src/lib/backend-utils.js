/**
 * Backend utility functions
 *
 * Borrowed from Practicle7. This practice of using a golden copy of .json will be replaced later by database.
 *
 * The assumption is that the working data store is found in data/films.json and we have a "golden copy" in data/mockData.json.
 */

import process from "process";

import knexConfig from "../../knexfile";
import knexInitializer from "knex";

export const knex = knexInitializer(
  knexConfig[process.env.NODE_ENV || "development"]
);

/**
 * Get the list of genre names for a film.
 *
 * @param {integer} id
 * @returns an array of genre names for film with id id
 */
export async function getGenres(id) {
  const genres = await knex
    .select("genreName")
    .from("Genre")
    .where({ filmId: id });
  return genres.map((entry) => entry.genreName);
}

/**
 * Get the list of course names for a film.
 *
 * @param {integer} id the film id
 * @returns an array of course names for film with id id
 */
export async function getCourse(id) {
  const courses = await knex
    .select("courseFilmName")
    .from("CourseFilm")
    .where({ filmId: id });
  return courses.map((entry) => entry.courseFilmName);
}

/**
 * Get the list of director names for a film.
 *
 * @param {integer} id
 * @returns an array of director names for film with id id
 */
export async function getDirectors(id) {
  const directors = await knex
    .select("directorName")
    .from("DirectorsFilm")
    .join("Directors", "Directors.directorId", "DirectorsFilm.directorId")
    .where({ filmId: id });
  return directors.map((entry) => entry.directorName);
}

/**
 * Get the list of actor names for a film.
 *
 * @param {integer} id
 * @returns an array of actor names for film with id id
 */
export async function getActors(id) {
  const actors = await knex
    .select("actorName")
    .from("Actors")
    .where({ filmId: id });
  return actors.map((entry) => entry.actorName);
}

/**
 * Get the list of contributor names for a film.
 *
 * @param {integer} id
 * @returns an array of contributor names for film with id id
 */
export async function getContributors(id) {
  const contributors = await knex
    .select("contributorName")
    .from("Contributors")
    .where({ filmId: id });
  return contributors.map((entry) => entry.contributorName);
}

/**
 * Get the poster of a film.
 *
 * @param {string} slug
 * @returns the poster object, in the form of {posterData:"the base64 string"}
 */
export async function getPosterBySlug(slug) {
  /*
  if (slug==='temp') {
    // default poster
    return {posterData: fs.readFileSync("./public/defaults/salmon-blue.jpg", {encoding: "base64"})}
  }
  */
  const poster = await knex.select("posterData")
    .from("Poster")
    .where({ "filmSlug": slug });
  return poster[0];
}

/**
 * Get the backdrop of a film.
 *
 * @param {string} slug
 * @returns the backdrop object, in the form of {backdropData:"the base64 string"}
 */
export async function getBackdropBySlug(slug) {
  /*
  if (slug==='temp') {
    // default backdrop
    return {backdropData: fs.readFileSync("./public/defaults/blue-white.jpg", {encoding: "base64"})}
  }
  */
  const backdrop = await knex.select("backdropData")
    .from("Backdrop")
    .where({ "filmSlug": slug });
  return backdrop[0];
}

/**
 * Get the list of the names of all genres present in the database
 *
 * @returns an array of all genre names for all films in the database
 */
export async function getAllGenres() {
  const allGenreEntries = await knex.select()
    .from("Genre")
    .where({ approved: true });
  const allGenreNames = new Set(allGenreEntries.map((entry) => entry.genreName).flat());
  return Array.from(allGenreNames);
}

/**
 * Get the list of the names of all courses present in the database
 *
 * @returns an array of all course names for all films in the database
 */
export async function getAllApprovedCourses() {
  const allCourseEntries = await knex
    .select("courseName")
    .from("Course")
    .whereBetween("approvedFilmCount", [1, 10000]);
  return allCourseEntries.map((entry) => entry.courseName);
}

/**
 * Get the list of the names of all courses present in the database
 *
 * @returns an array of all course names for all films in the database
 */
export async function getAllCourses() {
  const allCourseEntries = await knex.select("courseName")
    .from("Course")
  return allCourseEntries.map((entry) => entry.courseName);
}

/**
 * An internal helper function that fills a film object
 * with genre, course, directors, actors, and contributors information.
 *
 * @param {Object} film
 * @returns an film object with new fields added
 */
async function fillFilm(film) {
  return {
    ...film,
    genre: await getGenres(film.id),
    course: await getCourse(film.id),
    directors: await getDirectors(film.id),
    actors: await getActors(film.id),
    contributors: await getContributors(film.id),
  };
}

/**
 * Get all of the films from the database
 *
 * @returns an array of all films
 */
export async function getAllFilms() {
  const films = await knex("Film").select().where({ approved: true });
  return await Promise.all(films.map(async (film) => await fillFilm(film)));
}

/**
 * Get all of the films from the database REGARDLESS of approval status
 *
 * @returns an array of all films
 */
export async function getReallyAllFilms() {
  const films = await knex("Film").select();
  return await Promise.all(films.map(async (film) => await fillFilm(film)));
}

/**
 * Get a random order of number films from the database
 * @param {integer} number the number of films to return
 * @returns an array of all films
 */
export async function getRandFilms(number) {
  const films = await knex("Film").select().orderByRaw("RANDOM()").limit(number).where({ approved: true });
  await Promise.all(films.map((film) => fillFilm(film)));
  return films;
}

/**
 * Get a single film from the database by its id
 *
 * @param {integer} id
 * @returns the film associated with id id
 */
export async function getFilmById(id) {
  const [film] = await knex("Film").select().where({ id: id });
  return film ? await fillFilm(film) : null;
}

/**
 * Get a single film from the database by its slug
 *
 * @param {string} slug
 * @returns the film associated with slug
 */
export async function getFilmBySlug(slug) {
  const [film] = await knex("Film").select().where({ slug: slug });
  return film ? await fillFilm(film) : null;
}

/**
 * Get the list of films of the given term
 *
 * @param {string} term
 * @returns an array of all films of the term
 */
export async function getFilmsByTerm(term) {
  const ids = await knex.select("id")
    .from("Film")
    .where({ term: term, approved: true });

  // Convert to compatible format with other backend-util GET functions.
  const filmIds = ids.map((obj) => {
    Object.defineProperty(
      obj,
      "filmId",
      Object.getOwnPropertyDescriptor(obj, "id")
    );
    delete obj["id"];
    return obj;
  });
  return filmIds;
}

/**
 * Get the list of films of the given genre
 *
 * @param {string} genre
 * @returns an array of all films of the genre
 */
export async function getFilmsByGenre(genre) {
  const filmIds = await knex
    .select("filmId")
    .from("Genre")
    .where({ "genreName": genre, "approved": true });
  return filmIds;
}

/**
 * Get the list of films of the given course
 *
 * @param {string} course
 * @returns an array of all films in the course
 */
export async function getFilmsByCourse(course) {
  const filmIds = await knex
    .select("filmId")
    .from("CourseFilm")
    .where({ courseFilmName: course });
  return filmIds;
}

/**
 * Get the list of films by the given director
 *
 * @param {string} name
 * @returns an array of all films by the director
 */
export async function getFilmObjectsByDirector(slug) {
  const filmIds = await knex
    .select("filmId")
    .from("DirectorsFilm")
    .join("Directors", "Directors.directorId", "DirectorsFilm.directorId")
    .where({ directorSlug: slug });

  let films = await Promise.all(
    filmIds.map(async (filmId) => await getFilmById(filmId.filmId))
  );

  films = films.filter((film) => film.approved)
  return films;
}

/**
 * Get the list of films by the given director
 *
 * @param {string} name
 * @returns an array of all films by the director
 */
export async function getFilmsByDirector(name) {
  const filmIds = await knex.select("filmId")
    .from("DirectorsFilm")
    .join("Directors", "Directors.directorId", "DirectorsFilm.directorId")
    .where({ "directorName": name });
  return filmIds;
}


/**
 * Get the list of films by the given actor
 *
 * @param {string} name
 * @returns an array of all films by the actor
 */
export async function getFilmsByActor(name) {
  const filmIds = await knex
    .select("filmId")
    .from("Actors")
    .where({ actorName: name });
  return filmIds;
}

/**
 * Get the list of films by the given contributor
 *
 * @param {string} name
 * @returns an array of all films by the contributor
 */
export async function getFilmsByContributor(name) {
  const filmIds = await knex
    .select("filmId")
    .from("Contributors")
    .where({ contributorName: name });
  return filmIds;
}

/** Get course by courseName
 *
 * @param {string} name
 * @returns an array of course info
 */
export async function getCourseByCourseName(name) {
  const wholeCourse = await knex
    .select()
    .from("Course")
    .where({ courseName: name });
  return wholeCourse;
}

/** Get director by directorName
 *
 * @param {string} name
 * @returns director object
 */
export async function getDirector(name) {
  const director = await knex("Directors")
    .select()
    .where({ directorName: name });
  // TODO: need to decide what to actually send!!!!!
  return director;
}

/** Get directorslug by a film slug
 *
 * @param {string} slug
 * @returns an array of director slugs
 */

export async function getDirectorSlugByFilmSlug(filmSlug) {
  const film = await getFilmBySlug(filmSlug);
  const filmId = film.id;

  const slugs = await knex
    .select("directorSlug")
    .from("DirectorsFilm")
    .where({ filmId: filmId })
    .join("Directors", "Directors.directorId", "DirectorsFilm.directorId");

  return slugs;
}

/** Get full director (backend function, never call directly from API)
 *
 * @param {string} slug a unique identifier for directors
 * @returns the entire director object from the database with all fields
 */

async function _getFullDirectorBySlug(slug) {
  const director = await knex("Directors")
    .select()
    .where({ directorSlug: slug });

  if (director && director.length) {
    return director[0];
  }

  return null;
}

function _filterDirector(director) {
  // check privacy boolean (check if we should remove email)
  // and remove any private fields

  if (director.directorMiddEmailIsPrivate) {
    delete director.directorMiddEmail;
  }

  if (director.directorPersonalEmailIsPrivate) {
    delete director.directorPersonalEmail;
  }

  delete director.directorMiddEmailIsPrivate;
  delete director.directorPersonalEmailIsPrivate;

  return director;
}

export async function getDirectorBySlug(slug) {
  const fullDirector = await _getFullDirectorBySlug(slug);

  if (!fullDirector) {
    return null;
  }

  const filteredDirector = _filterDirector(fullDirector);

  return filteredDirector;
}

export async function checkDirectorSlug(slug) {
  const director = await knex("Directors")
    .select("directorSlug")
    .where({ directorSlug: slug });

  if (director.length) {
    return true;
  }

  return false;
}

/** Get all director names
 *
 * @returns an array of all director names
 *
 */
export async function getAllDirectors() {
  const allDirectors = await knex.select("directorName").from("Directors");
  return allDirectors.map((entry) => entry.directorName);
}


export function validateFilterTerm(filterTerm) {
  const filters = [
    "genre",
    "course",
    "director",
    "actor",
    "contributor",
    "term",
  ];
  return filters.includes(filterTerm);
}

export async function getNextFilmId() {
  const filmId = await knex("Film").max("id");
  if (filmId && filmId[0]) {
    if (filmId[0].max) {
      // Production structure
      return filmId[0].max + 1;
    } else if (filmId[0]["max(`id`)"]) {
      // Local structure
      return filmId[0]["max(`id`)"] + 1;
    }
  }
  return 1;
}

/**
 * Add the validated [film] into the Film database
 * @param {Object} film
 * @returns the inserted new film object.
 */
export async function addFilm(film) {
  const nextId = await getNextFilmId();
  film.id = nextId;
  await knex("Film").insert(film);
  return await getFilmBySlug(film.slug);
}

/**
 * Add the director film relationship into the DirectorsFilm database
 *
 * @param {string} directorName - The name of the director
 * @param {integer} id - The id of the film
 * @returns the related film object.
 */
export async function addDirectorsFilm(directorName, filmId) {
  const [director] = await getDirector(directorName);
  await knex("DirectorsFilm").insert({
    filmId: filmId,
    directorId: director.directorId,
  });
  return await getFilmById(filmId);
}

/**
 * Add the genre film pair into the Genre DB
 *
 * @param {string} genreName
 * @param {integer} filmId
 * @returns the updated film object
 */
export async function addGenreFilm(genreName, filmId) {
  await knex("Genre").insert({ filmId: filmId, genreName: genreName, approved: false });
  return await getFilmById(filmId);
}

/**
 * Add the actor film pair into the Genre DB
 *
 * @param {string} actorName
 * @param {integer} filmId
 * @returns the updated film object
 */
export async function addActorFilm(actorName, filmId) {
  await knex("Actors").insert({ filmId: filmId, actorName: actorName });
  return await getFilmById(filmId);
}

/**
 * Add a new course to the Course DB
 *
 * @param {Object} new_course
 * @returns the new course object from the DB
 */
export async function addNewCourse(new_course) {
  await knex("Course")
    .insert({
      courseNumber: new_course.courseNumber,
      courseName: new_course.courseName,
      courseDescription: new_course.courseDescription ? new_course.courseDescription : ""
    });
  return await getCourseByCourseName(new_course.courseName);
}

/**
 * Add the course film pair into the CourseFilm DB
 *
 * @param {string} courseName
 * @param {integer} filmId
 * @returns the updated film object
 */
export async function addCourseFilm(courseName, filmId) {
  await knex("CourseFilm").insert({ filmId: filmId, courseFilmName: courseName });
  return await getFilmById(filmId);
}

/**
 * Add the poster of film with slug into the Poster DB
 *
 * @param {string} posterData_base64
 * @param {string} slug
 * @returns the updated film object
 */
export async function addPosterBySlug(posterData_base64, slug) {
  await knex("Poster").insert({ filmSlug: slug, posterData: posterData_base64 });
  return await getFilmBySlug(slug);
}
/**
 * Add the backdrop of film with slug into the Backdrop DB
 *
 * @param {string} backdropData_base64
 * @param {string} slug
 * @returns the updated film object
 */
export async function addBackdropBySlug(backdropData_base64, slug) {
  await knex("Backdrop").insert({ filmSlug: slug, backdropData: backdropData_base64 });
  return await getFilmBySlug(slug);
}

/**
 * Validates the film title
 * @param {string} title
 * @returns empty if valid, error message if invalid
 */
export function validateFilmTitle(title) {
  if (title.length < 1) {
    return "Title is required";
  }
  if (title.length > 100) {
    return "Title is too long";
  }
  //check for invalid characters with regex, allow letters, numbers, spaces, dashes, and punctuation
  if (!/^[a-zA-Z0-9 -]+$/.test(title)) {
    return "Title contains invalid characters";
  }

  return "";
}

/**
 * Validates the semester field, e.g. "F21"
 * @param {string} semester
 * @returns empty if valid, error message if invalid
 */
export function validateFilmSemester(semester) {
  if (semester.length === 3) {
    return "A semester must have a length of 3";
  }
  //check that a semester is F, W, or S, followed by 2 numbers
  if (!/^[FWS][0-9][0-9]$/.test(semester)) {
    return "Semester must be in the format FYY or WYY or SYY";
  }
  //check that the semester year is valid (that is is not in the future)
  const year = parseInt(semester.substring(1, 3)) + 2000;
  if (year > new Date().getFullYear() + 1) {
    //not sure if we need this +1 but it might help on the edge cases
    return "Semester year must be in the past";
  }

  return "";
}

/**
 * Validates the genre name, e.g. "Drama", "Sci-fi"
 * @param {string} genre
 * @returns empty if valid, error message if invalid
 */
export function validateFilmGenre(genre) {
  if (genre.length < 1) {
    return "Genre is required";
  }
  if (genre.length > 100) {
    return "Genre is too long";
  }
  //check for invalid characters with regex, allow letters and dashes
  if (!/^[a-zA-Z-]+$/.test(genre)) {
    return "Genre contains invalid characters";
  }
  return "";
}

/**
 * Validates a course name, e.g. "Sight and Sound"
 * @param {string} course
 * @returns empty if valid, error message if invalid
 */
export function validateFilmCourse(course) {
  if (course.length < 1) {
    return "Course is required";
  }
  if (course.length > 100) {
    return "Course is too long";
  }
  //check for invalid characters with regex, allow letters, spaces, dashes, and punctuation
  if (!/^[a-zA-Z0-9 -.;:'&/,]+$/.test(course)) {
    return "Course contains invalid characters";
  }

  return "";
}

/**
 * Validates the film overview(called logLine in front-end)
 * @param {string} overview - called logLine in front-end
 * @returns empty if valid, error message if invalid
 */
export function validateFilmOverview(overview) {
  if (overview.length < 1) {
    return "Overview is required";
  }
  if (overview.length > 160) {
    return "Overview is too long";
  }
  //check for invalid characters with regex, allow letters, numbers, spaces, dashes, and punctuation
  if (!/^[a-zA-Z0-9 -.;:'&/,]+$/.test(overview)) {
    return "Overview contains invalid characters";
  }

  return "";
}

/**
 * Validates the film descipriton(called overview in front-end)
 * @param {string} description
 * @returns empty if valid, error message if invalid
 */
export function validateFilmDescription(description) {
  if (description.length < 1) {
    return "description is required";
  }
  if (description.length > 1000) {
    return "description is too long";
  }
  //check for invalid characters with regex, allow letters, numbers, spaces, dashes, and punctuation
  if (!/^[a-zA-Z0-9 -.;:'&/,]+$/.test(description)) {
    return "description contains invalid characters";
  }

  return "";
}

/**
 * Validates a string of actor names, e.g. "John Doe, Jane Doe, Someone Else"
 * @param {string} actors
 * @returns empty if valid, error message if invalid
 */
export function validateFilmActors(actors) {
  if (actors.length < 1) {
    return "Actors are required";
  }
  if (actors.length > 1000) {
    return "Actors is too long";
  }
  //check for invalid characters with regex, allow letters, numbers, spaces, dashes, and punctuation
  if (!/^[a-zA-Z0-9 -,]+$/.test(actors)) {
    return "Actors contains invalid characters";
  }
  //require all names to be separated by a comma
  if (!/^[a-zA-Z0-9 -,]+(,[a-zA-Z0-9 -,]+)*$/.test(actors)) {
    return "Actors must be separated by commas";
  }

  return "";
}

/**
 * Update film approval
 *
 * @param {string} slug
 * @param {boolean} rating
 * @returns Boolean indicating approve or reject
 */
export async function updateFilmApproval(slug, approve) {
  // getting the original film before changing anything
  const origFilm = await getFilmBySlug(slug);

  if (!origFilm) return;

  if (!!origFilm.approved === approve) {
    // No update needed
    return false;
  } else {
    // Update Film DB boolean
    await knex("Film").select()
      .where({ slug: slug })
      .update({ approved: approve });

    // Increment count for course DB
    await Promise.all(origFilm.course.map(async (courseName) => {
      if (approve) {
        await knex("Course").select()
          .where({ courseName: courseName })
          .increment("approvedFilmCount", 1);
      } else {
        await knex("Course").select()
          .where({ courseName: courseName })
          .decrement("approvedFilmCount", 1);
      }
    }));

    // Update Genre DB boolean
    await knex("Genre").select()
      .where({ filmId: origFilm.id })
      .update({ approved: approve });
  }

  return true;
}

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export async function processDirector(director) {
  director.directorSlug.trim()
  let error = null;

  const processedDirector = {
    directorName: director.directorName.trim(),
    directorSlug: director.directorSlug.trim(),
    directorBio: director.directorBio.trim(),
    directorClassYear: Math.abs(+director.directorClassYear),
    directorMiddEmail: director.directorMiddEmail.trim(),
    directorPersonalEmail: director.directorPersonalEmail.trim(),
    directorMiddEmailIsPrivate:
      director.directorMiddEmailIsPrivate ?? true,
    directorPersonalEmailIsPrivate:
      director.directorPersonalEmailIsPrivate ?? true,
  };
  //check that all of the above fields are not null or undefined
  Object.keys(processedDirector).forEach((key) => {
    if (
      processedDirector[key] === null ||
      processedDirector[key] === undefined
    ) {
      error = new Error(`${key} is null or undefined`);
    }
  });
  //check types for each key
  //type mapping
  const typeMapping = {
    directorName: "string",
    directorSlug: "string",
    directorBio: "string",
    directorClassYear: "number",
    directorMiddEmail: "string",
    directorPersonalEmail: "string",
    directorMiddEmailIsPrivate: "boolean",
    directorPersonalEmailIsPrivate: "boolean",
  };
  //check types
  Object.keys(processedDirector).forEach((key) => {
    if (typeof processedDirector[key] !== typeMapping[key]) {
      error = new Error(`${key} is not of type ${typeMapping[key]}`);
    }
  });

  const current_year = new Date().getFullYear();
  const max_graduation_year = current_year + 6.5;
  if (
    processedDirector.directorClassYear < 1900 ||
    processedDirector.directorClassYear > max_graduation_year
  ) {
    error = new Error(
      `director graduation year is not in range 1900-${max_graduation_year}`
    );
  }

  //check that director slug is a valid slug
  if (director.directorSlug.length < 1) {
    throw new Error("director slug is required");
  }
  if (director.directorSlug.length > 40) {
    throw new Error("director slug is too long");
  }
  //check that director slug is unique (need to implement incrimental slug)
  if (processedDirector) {
    const exists = await checkDirectorSlug(processedDirector.directorSlug);
    if (exists) {
      error = new Error("director slug is not unique");
    }
  }
  //check if midd email is valid
  if (!processedDirector.directorMiddEmail.endsWith("@middlebury.edu")) {
    error = new Error("director midd email is not a middlebury email");
  }
  //check if email is valid useing regex
  if (!validateEmail(processedDirector.directorPersonalEmail) || !validateEmail(processedDirector.directorMiddEmail)) {
    error = new Error("director personal email is not a valid email");
  }
  return { processedDirector: processedDirector, error: error };
}

/**
 * Add the validated director into the Director database
 * @param {Object} director
 * @returns the inserted new film object.
 */
export async function addDirector(director) {
  await knex("Directors").insert(director);
  return await _getFullDirectorBySlug(director.directorSlug);
}

/** Check if admin in Admins table by email
 *
 * @param {string} email
 * @returns an array
 *
 */
export async function checkAdmin(userName) {
  const existBool = await knex("Admins")
    .select("adminUserName")
    .where({ adminUserName: userName });
  return existBool.length > 0;
}

/** Add new admin
 *
 * @param {string} email
 * @returns object of fields admin and error
 *
 */
export async function addAdmin(admin) {

  let error = null;

  if (!admin.adminMiddEmail.endsWith("@middlebury.edu") || !validateEmail(admin.adminMiddEmail)) {
    error = new Error("admin email is not a valid middlebury email");
  }
  const exist = await checkAdmin(admin.adminUserName);
  if (exist) {
    error = new Error("admin already exists");
  } else {
    await knex("Admins").insert(admin);
  }
  return { admin: await checkAdmin(admin.adminUserName), error: error };
}

/** Get all admin accounts
 *
 * @returns array of users
 *
 */

export async function getAllUsers() {
  const allUsers = await knex("users").select();
  // check if each user is an admin
  const userAdmins = await Promise.all(
    allUsers.map(async (user) => ({ ...user, isAdmin: await checkAdmin(user.name) }))
  );
  return userAdmins;
}