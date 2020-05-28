const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// using backtick `
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: `sunpochin@gmail.com`,
        subject: 'Thanks for using!',
        text: `Welcome! ${name}. Let me know how you get along with this service.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: `sunpochin@gmail.com`,
        subject: 'Sorry to see you go...',
        text: `Goodbye, ${name}. See ya come back.`
    })
}

// //sgMail.send(msg)

// sgMail.send(msg, function(error) {
//     if (error) {
//         console.error(error.message)
//     }
// })

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail    
}
