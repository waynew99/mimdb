import nc from "next-connect";
import { addActorFilm, addBackdropBySlug, addCourseFilm, addDirectorsFilm, addFilm, addGenreFilm, addPosterBySlug, getDirector, getFilmBySlug } from "../../../lib/backend-utils";
import { convertToSlug } from "../../../lib/frontend-utils";

// Validates the inFilm object and add default empty picture paths
// TODO: potentially in the future if we have time, we can develop the validation process into a smart match process.
const validateAndProcessNewFilm = async (inFilm) => {
  try {
    // let processedFilm = {...inFilm, slug: convertToSlug(processedFilm.title)};
    const processedFilm = {
      "overview": inFilm.overview,
      "logLine": inFilm.logLine,
      "term": inFilm.term,
      "title": inFilm.title,
      "duration": inFilm.duration,
      "slug": convertToSlug(inFilm.title),
      "vimeoId": inFilm.vimeoId,
      "approved": false
    }

    if (processedFilm.title.includes("/")) {
      throw new Error("Suspicious. Why do you have a '/' in your title?");
    }

    // check slug, increment if duplicates slug
    // let index = 0;
    // Adds "-[index]""
    let index = /-\d+$/.test(processedFilm.title) ? (+processedFilm.title.match(/\d+$/g)[0]) : 0;
    while (await getFilmBySlug(processedFilm.slug)) {
      processedFilm.title = `${inFilm.title} ${++index}`;
      processedFilm.slug = convertToSlug(`${inFilm.title}-${index}`);
    }

    // Add default empty picture paths
    // TODO: to be replaced by user uploaded image paths, as well as randomly generated gradient
    processedFilm.backdropPath = (!inFilm.backdropPath || inFilm.backdropPath === "") ? "/defaults/salmon-blue.svg" : `/filmImages${inFilm.backdropPath}`;
    processedFilm.posterPath = (!inFilm.posterPath || inFilm.posterPath === "") ? `/defaults/chapelBackground-3-2.jpg` : `/filmImages${inFilm.posterPath}`;

    // Generate vimeo boolean, simple
    processedFilm.video = processedFilm.vimeoId && true;
    return processedFilm;
  }
  catch (error) {
    console.error(error);
    return null;
  }
};


const handler = nc()
  .post(async (req, res) => {
    const newFilm = req.body;
    const processedFilm = await validateAndProcessNewFilm(newFilm);

    if (processedFilm) {
      // The film validation passed
      let addedFilm = await addFilm(processedFilm); // add to the Film DB

      // Add director relationship to the DirectorsFilm DB
      await Promise.all(newFilm.inputDirectorList.map(async (directorName) => {
        const director = await getDirector(directorName);
        if (director.length === 0) {
          res.status(500).json({
            error: `The given director does not exist: ${directorName}`
          });
          return;
        }
        addedFilm = await addDirectorsFilm(directorName, addedFilm.id);
      }));

      // Add course relationship to the CourseFilm DB
      await Promise.all(newFilm.courseList.map(async (courseName) => {
        addedFilm = await addCourseFilm(courseName, addedFilm.id);
      }));

      // Add actors to the Actors DB
      await Promise.all(newFilm.inputActorList.map(async (actorName) => {
        addedFilm = await addActorFilm(actorName, addedFilm.id);
      }));

      // Add genre to the Genre DB
      await Promise.all(newFilm.genreList.map(async (genreName) => {
        addedFilm = await addGenreFilm(genreName, addedFilm.id);
      }));

      // Add poster to Poster DB

      // Testing place holder
      addedFilm = await addPosterBySlug(newFilm.poster, processedFilm.slug);
      //addedFilm = await addPosterBySlug(default_grey_svg, processedFilm.slug)  

      // Testing place holder
      // Add backdrop to Backdrop DB
      addedFilm = await addBackdropBySlug(newFilm.backdrop, processedFilm.slug);
      //addedFilm = await addBackdropBySlug(default_grey_svg, processedFilm.slug) 
      res.status(200).json(addedFilm);
    } else {
      res.status(500).json({
        error: "New film validation did not pass"
      });
    }
  });

export default handler;
