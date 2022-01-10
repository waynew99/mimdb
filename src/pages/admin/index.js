import Layout from "../../components/Layouts/Layout";
import AdminPageFilms from "../../components/Admins/AdminPageFilms";
import AdminPageAdmin from "../../components/Admins/AdminPageAdmins";
import NotFound from "../../components/NotFound";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/client";

import styles from "../../styles/Admin.module.scss";


export default function Admin() {
  const [films, setFilms] = useState([]);
  const [users, setUsers] = useState([]);
  const [outdated, setOutdated] = useState(true);
  const [toggle, setToggle] = useState(true);
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

  // get all users
  useEffect(async () => {
    const response = await fetch("api/users");
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const allUsers = await response.json();
    setUsers(allUsers);
  }, [])

  const adminFunc = (apiCall, film) => {
    const helper = async () => {
      if (film) {
        const response = await fetch(`/api/films/${film.slug}/${apiCall}`, {
          method: "PUT"
        })
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        setOutdated(true);
      }
    }
    helper();
  }

  return (
    <Layout pageTitle="MIMDB | Admin Dashboard">
      {session ?
        <div>
          <div className={styles.authorizeButtons}>
            <button onClick={() => setToggle(!toggle)} disabled={toggle}>Authorize Films</button>
            <button onClick={() => setToggle(!toggle)} disabled={!toggle}>Authorize Admins</button>
          </div>
          {toggle ?
            <AdminPageFilms films={films} adminFunc={adminFunc} />
            : <AdminPageAdmin users={users} />}
        </div>
        : 
        <div>
          <h2>You are not authorized to access this page</h2>
          <NotFound />
          <br />
        </div>
      }
    </Layout>
  );
}