const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// using backtick `
const sendWelcomeEmail = (email, name) => {
    const response = sgMail.send({
        to: email,
        from: `sunpochin@gmail.com`,
        subject: 'Thanks for using!',
        text: `Welcome! ${name}. Let me know how you get along with this service.`
    })
    console.log('sendWelcomeEmail: ', response)
    return response;
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: `sunpochin@gmail.com`,
        subject: 'Sorry to see you go...',
        text: `Goodbye, ${name}. See ya come back.`
    })
    console.log('sendCancelationEmail: ', sgMail)
}


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail    
}
