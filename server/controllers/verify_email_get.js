(function() {
    function execute(rqst, utils, q) {
        console.log(rqst.query)

        const DA = require("../db/da").DA;

        
        return q.resolve({
            "code": 1,
            "message": rqst.query
        })
        // rqst.query.token
        // Find user by token :  where user.emailAddressVerificationToken == rqst.query.token
        // isEmailVerified - IF already verified = return message
        // emailTokenExpiredAfter -If expired 7 days. Return error
        //emailAddressVerificationToken == matched?
        // Set isEmailVerified = true
        // emailAddressVerificationToken = null
    }
    exports.execute = execute;
})()