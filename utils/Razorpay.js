import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
    key_id: "fjufji",
    key_secret: process.env.RAZORPAY_SECRET
})

export default razorpayInstance