import nc from "next-connect";
import { addFilm, getFilmBySlug } from "../../../lib/backend-utils";
import { convertToSlug } from "../../../lib/frontend-utils";

// Validates the inFilm object and add default empty picture paths
// TODO: potentially in the future if we have time, we can develop the validation process into a smart match process.
const validateAndProcessNewFilm = async (inFilm) => {
  try {
    // let processedFilm = {...inFilm, slug: convertToSlug(processedFilm.title)};
    const processedFilm = {
      "overview": inFilm.overview,
      "description": inFilm.description,
      "release_date": inFilm.release_date,
      "title": inFilm.title,
      "vimeo_id": inFilm.vimeo_id,
      "duration": inFilm.duration,
      "slug": convertToSlug(inFilm.title)
    }

    // check slug, increment if duplicates slug
    let index = 0;
    while (await getFilmBySlug(processedFilm.slug)) {
      processedFilm.title = `${processedFilm.title} ${(++index).toString()}`;
      processedFilm.slug = convertToSlug(processedFilm.title);
    }
    
    // Add default empty picture paths
    // TODO: to be replaced by user uploaded image paths, as well as randomly generated gradient
    processedFilm.backdrop_path = (!inFilm.backdrop_path || inFilm.backdrop_path==="") ? "/defaults/backdrops/chapelBackground.jpg" : `/filmImages${inFilm.backdrop_path}`;
    processedFilm.poster_path = (!inFilm.poster_path || inFilm.poster_path==="") ? `/defaults/purple-orange.svg` : `/filmImages${inFilm.poster_path}`;
    
    // Generate vimeo boolean, simple
    // TODO: remove check against test data mock vimeo_id
    processedFilm.video = processedFilm.vimeo_id && processedFilm.vimeo_id!=="12345678";

    // Directore stuffs later
    return processedFilm;
  }
  catch (error) {
    console.log(error);
    return null;
  }
};


const handler = nc()
  .post(async (req, res) => {
    const newFilm = req.body;
    console.log(newFilm);
    const processedFilm = await validateAndProcessNewFilm(newFilm);

    if (processedFilm) {
      // The film validation passed
      let addedFilm = await addFilm(processedFilm); // add to the Film DB

      // Add director relationship to the DirectorsFilm DB
      await Promise.all(newFilm.inputDirectorList.map(async (director_name) => {
        const director = await getDirector(director_name);
        if (director.length===0) {
          res.status(500).json({
            error: `The given director does not exist: ${director_name}`
          });
          return;
        }
        addedFilm = await addDirectorsFilm(director_name, addedFilm.id);
      }));

      // Add course relationship to the CourseFilm DB
      await Promise.all(newFilm.courseList.map(async (course_name) => {
        const course = await getCourseByCourseName(course_name);
        if (course.length===0) {
          // The given course does not exist, so create one before establishing relationship
          await addNewCourse({course_name:course_name, course_number:newFilm.courseId});
        }
        addedFilm = await addCourseFilm(course_name, addedFilm.id);
      }));

      // Add actors to the Actors DB
      await Promise.all(newFilm.inputActorList.map(async (actor_name) => {
        addedFilm = await addActorFilm(actor_name, addedFilm.id);
      }));

      // Add genre to the Genre DB
      await Promise.all(newFilm.genreList.map(async (genre_name) => {
        addedFilm = await addGenreFilm(genre_name, addedFilm.id);
      }));

      console.log("added: ", addedFilm);
      res.status(200).json(addedFilm);
    } else {
      console.log("500 here");
      res.status(500).json({
        error: "New film validation did not pass"
      });
    }
  });

export default handler;
