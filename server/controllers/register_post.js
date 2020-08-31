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
            res.json({ "errors": validationErrors })
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

            const DA = require("../db/da").DA;

           	







            // fwk.db.Users.getUsers({
            //     "email": rqst.body.emailAddress
            // }, {}, {}, fwk, (err, users) => {
            //     if (users && users.length) {
            //         fwk.resolveResponse(q, 1, 200, {}, `User already exist with given email ${rqst.body.emailAddress}.`);
            //     } else {
            //         createRandomToken
            //             .then((token) => {
            //                 let now = new Date();
            //                 user.emailAddressVerificationToken = token;
            //                 // 7 days expiration for token
            //                 user.emailAddressVerificationTokenExpiresAfter = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000))
            //                 return {
            //                     token: token,
            //                     email: user.emailAddress,
            //                     host: rqst.req.headers.host
            //                 };
            //             }).then((tokenParams) => {
            //                 return new Promise((resolve, reject) => {
            //                     fwk.db.Users.createUser(user, fwk, (err, results) => {
            //                         if (err) {
            //                             reject(err);
            //                         } else {
            //                             console.warn(`New user created with response ${JSON.stringify(results)}`);
            //                             resolve(tokenParams);
            //                         }
            //                     })
            //                 });
            //             })
            //             .then(sendVerifyEmail)
            //             .then((emailResponse) => {
            //                 console.warn(`Email Response ${JSON.stringify(emailResponse)}`);
            //                 fwk.resolveResponse(q, 0, 200, {
            //                     "msg": `An e-mail has been sent to ${user.emailAddress} with further instructions.`
            //                 }, `An e-mail has been sent to ${user.emailAddress} with further instructions.`);
            //             })
            //             .catch((err) => {
            //                 fwk.resolveResponse(q, 1, 200, {}, err.toString());
            //             });

            //     }
            // });
        }
    }

    exports.execute = execute;

    const randomBytesAsync = promisify(crypto.randomBytes);

    const createRandomToken = randomBytesAsync(16)
        .then((buf) => buf.toString('hex'));

    const sendVerifyEmail = (params) => {
        const emailBody = {
            to: params.emailAddress,
            from: 'WebSrv <bhunesh@websrv.com>',
            subject: 'Please verify your email address Web Srv',
            html: `Thank you for registering with Web Srv.<br>
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
        //return require("../../helpers/email_sender").EmailSender.send(emailBody)
    };
})()