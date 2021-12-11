import styles from "../styles/DirectorsPage.module.scss";
import FilmRow from "./DisplayLayouts/FilmRow.js";
import NotFound from "./NotFound";

export default function DirectorPage({ films, director }) {

  if (!director) {
    return <NotFound>Director not found</NotFound>;
  }

  return (
      <div className={styles.largeContainer}>
        <div className={styles.topBox}>
          <div className={styles.directorInfo}>
            <h1 data-testid="directorPageName">{director.directorName}</h1>
            <div className={styles.classEmail}>
              <h4
                className={styles.classYear}
                data-testid="directorClassYearShown"
              >
                {director.directorClassYear}
              </h4>
              <h4 className={styles.email} data-testid="directorMiddEmail">
                {director.directorMiddEmail}
              </h4>
              <h4 className={styles.email} data-testid="directorPerseEmail">
                {director.directorPersonalEmail}
              </h4>
            </div>
          </div>
          <div className={styles.bio}>
            <h3>Biography</h3>
            <p className={styles.bioText} data-testid="directorBio">
              {director.directorBio}
            </p>
          </div>
        </div>
        <div className={styles.filmRowCont}>
          {films && films.length ? (
            <FilmRow films={films} title={`Films by ${director.directorName}`} />
          ) : (
            null
          )}
        </div>
      </div>
  );
}
