(function() {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SUPERMAN_SG_KEY);

    function send(emailBody) {
        const msg = {
            to: emailBody.to,
            from: emailBody.fromAddress,
            subject: emailBody.subject,
            html: emailBody.htmlText,
        };
        console.log(`Email Params ${JSON.stringify(msg)}`)

        return new Promise((resolve, reject) => {
            sgMail.send(msg).then((sgSuccessResponse) => {
                return resolve(sgSuccessResponse)
            }, (sgError) => {
                return reject(sgError);
            })
        })
    }

    exports.send = send;
})()