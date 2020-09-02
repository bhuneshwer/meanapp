(function() {
    const validator = require('validator');
    const {
        promisify
    } = require('util');
    const crypto = require('crypto');
    const bcrypt = require('bcrypt');

    function execute(rqst, utils, q) {

        const {
            emailAddress,
            password,
            fullName
        } = rqst.body;


        const validationErrors = [];

        if (!emailAddress || !validator.isEmail(rqst.body.emailAddress)) validationErrors.push({
            msg: 'Please enter a valid email address.'
        });

        if (validationErrors.length) {
            return q.resolve({ "errors": validationErrors })
        } else {

            rqst.body.emailAddress = rqst.body.emailAddress.toLocaleLowerCase();

            let user = {
                emailAddress: rqst.body.emailAddress,
                password: rqst.body.password || null,
                createdDate: new Date(),
                isEmailVerified: false,
                fullName: rqst.body.fullName
            }

            // Encrypt the password using Bcrypt using salt value as 10

            if (user.password && user.password.length) {
                user.password = bcrypt.hashSync(user.password, 10);
            }


            let queryParams = {
                "emailAddress": rqst.body.emailAddress
            }
            // Get the DA object
            const DA = require("../db/da").DA;
            // args
            DA.getByQuery("users", queryParams, utils, {}).then((results) => {
                if (results && results.length) {
                    return q.resolve({
                        "code": 1,
                        "errMsg": `User with given email address is already registered.`
                    })
                } else {
                    createUser();
                }
            }).catch((err) => {
                return q.resolve({
                    "code": 1,
                    "errMsg": `Exception has been raised \n ${err.toString()}`
                })
            })



            function createUser() {
                createRandomToken.then((token) => {
                        let now = new Date();
                        // assigning random token for email verification
                        user.emailAddressVerificationToken = token;
                        // Setting expiration time as 7 days
                        user.emailTokenExpiredAfter = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                        return {
                            "token": token,
                            "emailAddress": user.emailAddress,
                            "host": rqst.req.headers.host
                        }
                    }).then((tokenParams) => {
                        // Adding a entry of user object into the users collection
                        return new Promise((resolve, reject) => {
                            DA.create("users", user, utils, {}).then((insertedData) => {
                                resolve(tokenParams);
                            }, (userCreationDbErr) => {
                                reject(userCreationDbErr);
                            })
                        })
                    }).then(sendVerifyEmail)
                    .then((emailResponse) => {
                        console.warn(`Email Response ${JSON.stringify(emailResponse)}`);
                        return q.resolve({
                            "code": 0,
                            "msg": `An e-mail has been sent to ${user.emailAddress} with further instructions.`
                        })
                    }).catch((error) => {
                        console.warn("Exception has been raised", error.toString());
                        return q.resolve({
                            "code": 1,
                            "errMsg": `Exception has been raised. \n  ${error.toString()}`
                        })
                    })
            }
        }
    }



    exports.execute = execute;
    //The crypto.randomBytes() method is used to generate a cryptographically well-built artificial random data 
    // and the number of bytes to be generated in the written code.
    // https://www.geeksforgeeks.org/node-js-crypto-randombytes-method/
    // https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback

    const randomBytesAsync = promisify(crypto.randomBytes);

    const createRandomToken = randomBytesAsync(16)
        .then((buf) => buf.toString('hex'));

    const sendVerifyEmail = (params) => {

        const emailSender = require("../helpers/email_sender");
        const emailBody = {
            to: params.emailAddress,
            fromAddress: 'Superman Noledge <superman.noledge@gmail.com>',
            subject: 'Please verify your email address Superman Noledge',
            htmlText: `Thank you for registering with Superman Noledge.<br>
            For security reasons, we need to validate your email address before you gain access to the site. Just click below to validate your address:<br><br> 
            <a  type="button" style="padding: 8px 20px;
            background: #0070d3;
            text-decoration: none;
            color: #fff;
            box-shadow: 1px 1px 1px rgba(0,0,0,0.3)"
            href=http://${params.host}/api/accounts/verify?token=${params.token}>Verify Email</a>
            <br>
            <p>If clicking on the above link does not work, please copy and paste the URL below in a browser to verify your email address:</p>
            <a href=http://${params.host}/api/accounts/verify?token=${params.token}>http://${params.host}/api/accounts/verify?token=${params.token}</a>
            <br>
            <br>
            Thank you!`
        };
        console.warn(`calling email send with ${JSON.stringify(emailBody)}`);
        return emailSender.send(emailBody);
    };
})()