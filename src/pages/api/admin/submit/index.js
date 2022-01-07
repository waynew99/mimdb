import nc from "next-connect";
import { getSession } from "next-auth/client";
import { checkAdmin, addAdmin } from "../../../../lib/backend-utils";


const handler = nc().post(async (req, res) => {
    const session = await getSession({ req });

    if (!session || !await checkAdmin(session.user.name)) {
        res.status(401).json({ // forbidden
            message: "Only logged in administrator can add new administrator"
        })
        return;
    }

    const newAdmin = req.body;
    const { admin, error } = await addAdmin(newAdmin);
    console.log(admin, error)
    if (error) { // bad request
        res.status(400).json({
            error: error
        });
        return;
    }
    admin ?
        res.status(200).json({
            message: `successfully added admin ${newAdmin.adminUserName}`
        })
        : res.status(500).json({
            message: `unable to add admin ${newAdmin.adminUserName}`
        })
    return;
});


export default handler;