(function() {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SUPERMAN_SG_KEY || "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");

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