const generateOTP = function () {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
  
    // Set the expiration time to 10 minutes from now
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);
  
    return { otp: otp.toString(), expiresAt: expirationTime };
  }
  
  export default generateOTP
  // Example usage
//   const otpData = generateOTP();
//   console.log(`Generated OTP: ${otpData.otp}`);
//   console.log(`Expires at: ${otpData.expiresAt}`);
  