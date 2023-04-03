const UnauthenticatedError = require("../errors/unauthenticated")
const UnauthorizedError = require("../errors/unauthorized")
const { verifyToken } = require("./jwt")


async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided")
  }

  const token = authHeader.split(" ")[1]

  try {
    const verifiedToken = await verifyToken(token)
    console.log(verifiedToken);
    const { user_id, name, role, email, mother_company } = verifiedToken
    req.user = { user_id, name, role, mother_company, email }
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication token is invalid")
  }
  
}

function authorizeUser(...roles){
  return function(req, res, next){
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route')
    }
    next()
  }
}

module.exports = { authenticateUser, authorizeUser } 