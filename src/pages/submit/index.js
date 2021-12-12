import { useState, useEffect } from "react";
import { DirectorNameContext } from "../../components/context/DirectorNameContext";

import Layout from "../../components/Layouts/Layout";
import Submit from "../../components/Submit";

import styles from "../../styles/Home.module.css";


export default function SubmitPage() {
  const [directorNames, setDirectorNames] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(async () => {
    // courses
    const allCoursesRes = await fetch("/api/courses/all");
    if (!allCoursesRes.ok) {
      throw new Error("Failed to fetch director name information from api");
    }
    const allCourses = await allCoursesRes.json();

    // directors
    const directorNameRes = await fetch("/api/directors");
    if (!directorNameRes.ok) {
      throw new Error("Failed to fetch director name information from api");
    }
    const directors = await directorNameRes.json();

    setCourses(allCourses);
    setDirectorNames(directors);
  }, []);


  const submitComplete = async (content) => {
    const postSubmit = async () => {
      const response = await fetch("/api/submit", {
        method: "POST",
        body: JSON.stringify(content),
        headers: new Headers({ "Content-Type": "application/json" })
      });
      let error = null;
      if (!response.ok) {
        error = new Error(response.statusText);
      }

      return ({ ok: response.ok, error });
    }
    return await postSubmit();
  }

  const DirectorNameContextObject = { directorNames: directorNames };

  return (
    <div className={styles.container}>
      <Layout>
        <DirectorNameContext.Provider value={DirectorNameContextObject}>
          <Submit allCourses={courses} complete={submitComplete} />
        </DirectorNameContext.Provider>
      </Layout>
    </div>
  );
}