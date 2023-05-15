module.exports = {

    adminLogin: (body) => {   

        return new Promise(async (resolve, reject) => {
            let response = {}
            // Pro setting For admin Login

            const proAdmin = {
                FullName: process.env.ADMIN_FULLNAME,
                Description: process.env.ADMIN_DISCR, 
                UserName: process.env.ADMIN_USERNAME,
                EmailId: process.env.ADMIN_EMAILID,
                Password: process.env.ADMIN_PASSWORD
            }

            // Check Pro admin
            if (body.EmailId == proAdmin.EmailId) {
                if (body.Password == proAdmin.Password) {
                    response.admin = proAdmin
                    delete response.admin.Password
                    resolve(response)
                } else {
                    resolve({ PasswordErr: true })
                }
            } else {
                resolve({ EmailErr: true })
            }
        })
    }
}