module.exports = (req,res,next) => {
    if(!req.session.isLoggedIn){
        return res.json({message: 'UnAuthorized'})
    }
    next();
}