const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        })


        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to:`${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        return true;
    }
    catch(error) {
        console.log("Error occured while sending mail", error.message);
    }
}


module.exports = mailSender;