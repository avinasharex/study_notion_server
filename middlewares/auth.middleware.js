import jwt from "jsonwebtoken"
const isLoggedIn = (req,res,next)=>{
    const { token } = req.cookies

    if (!token) {
        return next(new AppError("Unauthenticated please login again", 400))
    }
    const userDetails = jwt.verify(token, process.env.JWT_SECRET)

    req.user = userDetails


    next();
}

const authorizedRoles = (...roles) => (req, res, next) => {
    const currentUserRole = req.user.role

    if (!roles.includes(currentUserRole)) {
        return next(new AppError("You do not permssion to access ", 400))
    }
    next();
}

export {isLoggedIn,authorizedRoles}