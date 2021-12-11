import nc from "next-connect";
import { addDirector, checkDirectorSlug, processDirector } from "../../../../lib/backend-utils";
import { convertToSlug } from "../../../../lib/frontend-utils";

const handler = nc().post(async (req, res) => {
  const director = req.body;

  if (!director) {
    res.status(400).json({
      error: "Director not properly included in request body",
    });
    return;
  }

  // check slug, increment if duplicates slug
  // Adds "-[index]""
  director.directorSlug = convertToSlug(director.directorName);
  const index = /-\d+$/.test(director.directorName) ? (+director.directorName.match(/\d+$/g)[0]) : 0;
  while (await checkDirectorSlug(director.directorSlug)) {
    director.directorSlug = convertToSlug(`${director.directorName}-${index}`);
  }

  if (await checkDirectorSlug(director.directorSlug)) {
    res.status(403).json({
      error: `Director with slug ${director.directorSlug} already exists`,
    });
    return;
  }

  //process the director
  const { processedDirector, error } = await processDirector(director);
  if (error) {
    console.log("error: ", error);
    res.status(400).json({
      error: error,
    });

    return;
  }
  //now insert the director into the database
  const insertedDirector = await addDirector(processedDirector);

  //return the director as success
  res.status(200).json(insertedDirector);
});

export default handler;
