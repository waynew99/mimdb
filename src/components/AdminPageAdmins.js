

export default function AdminPageAdmins({ users }) {

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Users of MIMDB</h1>
      <table 
        margin="2 auto"
        fontSize="large"
        border="1px solid black">
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Middlebury Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 && users.map((user) =>
            <tr key={user.id}>
              <td>{user["name"]}</td>
              <td>{user["email"]}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

}