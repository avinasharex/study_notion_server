import nodemailer from "nodemailer"

const mailSender = async(email,title,body)=>{
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: title,
            html: body
        })
    } catch (error) {
        console.log(error.message);
    }
}

export default mailSender