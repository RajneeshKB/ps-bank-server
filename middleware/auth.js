const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = require('../util/constants')

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization')
	if(!authHeader) {
		req.isAuth = false
		return next()
	}
	const token = authHeader.split(' ')[1]
	let decodedToken
	try{
		decodedToken = jwt.verify(token, TOKEN_KEY)
	}catch(err){
		req.isAuth = false
		return next()
	}
	if(!decodedToken) {
		req.isAuth = false
		return next()
	}
	req.customerId = decodedToken.customerId
	req.isAuth = true
	next()
}