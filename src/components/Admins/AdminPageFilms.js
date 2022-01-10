
import { useState } from "react";

export default function AdminPageFilms({ films, adminFunc }) {
  const [update, refresh] = useState(true);
  const fields = ["title", "overview", "term", "duration", "genre", "course", "directors", "actors"];

  function approvalField(film) {
    const [status1, status2, status3] = film.approved ?
      ["Approved", "reject", "Reject"] : ["Not approved", "approve", "Approve"];
    return (
      <td style={{ padding: "0.2em", textAlign: "center" }}>
        <p style={{ color: "green" }}>{status1}</p>
        <button
          onClick={() => { adminFunc(status2, film); refresh(!update) }}>
          {status3}
        </button>
      </td>
    )
  }

  return (
    <div style={{ padding: "4em", paddingTop: "0em" }}>
      <h1>Films in the MIMDB Database</h1>
      <table
        margin="2 auto" fontSize="large" border="1px solid black">
        <thead>
          <tr>
            <th>Approved</th>
            {fields.map((field) =>
              <th key={field} style={{ padding: "0.3em" }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </th>)}
          </tr>
        </thead>

        <tbody>
          {films.map((film) =>
            <tr key={film.id}>
              {approvalField(film)}
              {fields.map((field) => {
                if (typeof film[field] === "object") {
                  return <td key={field} style={{ padding: "0.3em" }}>{film[field].join(", ")}</td>
                } else {
                  return <td key={field} style={{ padding: "0.3em" }}>{film[field]}</td>
                }
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}