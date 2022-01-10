import nc from "next-connect";
import { getSession } from "next-auth/client";
import { deleteAdmin } from "../../../lib/backend-utils";

const handler = nc().delete(async (req, res) => {
    const session = await getSession({ req });

    if (!session || !await checkAdmin(session.user.name)) {
        res.status(401).json({ // forbidden
            message: "Only logged in administrator can delete old administrator"
        })
        return;
    }

    const oldAdmin = req.body;
    const deleted = await deleteAdmin(oldAdmin.adminUserName);
    deleted ?
        res.status(200).json({
            message: `successfully deleted admin ${oldAdmin.adminUserName}`
        })
        : res.status(500).json({
            message: `unable to delete admin ${oldAdmin.adminUserName}`
        })
});

export default handler;