import Layout from "../../components/Layouts/Layout";
import AdminPageAdmins from "../../components/AdminPageAdmins";
import { useEffect, useState } from "react";


export default function AddAdmin() {
    const [users, setUsers] = useState([]);

    // test get all users
    useEffect(async () => {
        const response = await fetch("api/users");
        console.log(response);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const allUsers = await response.json();
        setUsers(allUsers);
    }, [])

    return (
        <Layout>
            <AdminPageAdmins users={users} />
        </Layout>
    )
}