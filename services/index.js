const { loginUser, checkForExistingUser, signupUser }  = require("../repositories")
const crypto = require("crypto")

exports.loginService = async (loginData) => {
    const {email, password} = loginData
    const result = await loginUser(loginData); // login query
    if(result.length > 0)
    {
        const salt = result[0].salt;
        const databasePass = result[0].password;

        const hash = crypto.createHash('sha256');
        hash.update(salt + password)
        const hashedPassword = hash.digest('hex')

        if(databasePass != hashedPassword)
        {
            throw new Error("Wrong Password");
        }
        else return result;
    }
    else return result;
};

exports.signupService = async(signupData) => {
    const result = await checkForExistingUser ( signupData );  // to check for existing user

    if(result.length > 0)
    {
        return result;
    } else {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha256');
        hash.update(salt + signupData.password)

        const hashedPassword = hash.digest('hex')

        signupData.password = hashedPassword;
        signupData.salt = salt;

        const insert = await signupUser( signupData ); // To insert new user
        return insert;
    }
}