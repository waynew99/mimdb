import { useState } from "react";

export default function AdminPageAdmins({ users, adminFunc }) {

  

  return (
    <div style={{padding: "4em", paddingTop: "0em"}}>
      <h1>Users of MIMDB</h1>
      <table
        margin="2 auto" fontSize="large" border="1px solid black">
        <thead>
          <tr>
            <th style={{ padding: "0.3em" }}>Authorize Administrator</th>
            <th style={{ padding: "0.3em" }}>Username</th>
            <th style={{ padding: "0.3em" }}>User Middlebury Email</th>
          </tr>
        </thead>
        
        <tbody>
          {users.length > 0 && users.map((user) =>
            <tr key={user.id}>
              <td style={{ padding: "0.3em" }}>{user["idAdmin"] ? "Admin" : "User"}</td>
              <td style={{ padding: "0.3em" }}>{user["name"]}</td>
              <td style={{ padding: "0.3em" }}>{user["email"]}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}