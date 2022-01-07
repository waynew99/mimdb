import Layout from "../../../components/Layouts/Layout";
import AdminPageFilms from "../../../components/AdminPageFilms";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/client";

import NotFound from "../../../components/NotFound";


export default function Admin() {
  const [films, setFilms] = useState([]);
  const [outdated, setOutdated] = useState(true);
  const [session] = useSession();

  // // add new admins test
  // useEffect(() => {
  //   const newAdminstest = async () => {
  //     const response = await fetch("/api/admin/submit", {
  //       method: "POST",
  //       body: JSON.stringify({ adminUserName: "tester2", adminMiddEmail: "test2@middlebury.edu" }),
  //       headers: { "Content-Type": "application/json" }
  //     })
  //     if (!response.ok) {
  //       throw new Error(response.statusText);
  //     }
  //     const message = await response.json();
  //     console.log(message);

  //   }
  //   newAdminstest();
  // }, [])



  // fetch ALL films
  useEffect(() => {
    const getAllFilms = async () => {
      const response = await fetch(`/api/films/all`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const filmData = await response.json();
      setFilms(filmData);
    }
    if (outdated) {
      getAllFilms();
    }
    setOutdated(false);
  }, [outdated]);

  const adminFunc = (apiCall, film) => {
    const helper = async () => {
      if (film) {
        const response = await fetch(`/api/films/${film.slug}/${apiCall}`, {
          method: "PUT"
        })

        if (!response.ok) {
          throw new Error(response.statusText)
        }
        setOutdated(true);
      }
    }
    helper();
  }

  return (
    <Layout pageTitle="MIMDB | Admin Dashboard">
      {session ? <AdminPageFilms films={films} adminFunc={adminFunc} />
        : <div>
          <p>You are not authorized to access this page</p>
          <NotFound />
          <br></br>
        </div>}

    </Layout>
  );
}