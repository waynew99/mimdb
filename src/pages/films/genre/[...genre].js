import { useRouter } from "next/router";
import FilmRow from "../../../components/DisplayLayouts/FilmRow";
import Layout from "../../../components/Layouts/Layout";
import useFilmsByCategory from "../../../hooks/useFilmsByCategory";

export default function FilmsByGenre() {
  const router = useRouter();
  const { genre } = router.query;

  //convert from uri encoding to text
  const genreName = decodeURIComponent(genre);

  return (
    <Layout>
      <div className="container">
        <h1>{`${genreName}`} Films</h1>
        <FilmRow films={useFilmsByCategory({ category: "genre", value: genre })} />
      </div>
    </Layout>
  );
}
