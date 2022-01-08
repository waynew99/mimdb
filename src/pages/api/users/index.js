import nc from "next-connect";
import { getSession } from "next-auth/client";
import { getAllUsers, checkAdmin } from "../../../lib/backend-utils";

const handler = nc().get(async (req, res) => {
    const session = await getSession({ req });
    if (!session || !await checkAdmin(session.user.name)) {
        res.status(401).json({ // forbidden
            message: "Only logged in administrator can access user accounts"
        })
        return;
    }

    const allUsers = await getAllUsers();
    
    if (!allUsers) {
        res.status(500).json({
            message: "Cannot fetch all users"
        })
        return;
    }
    res.status(200).json(allUsers);

});

export default handler;