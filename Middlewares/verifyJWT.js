const jwt = require('jsonwebtoken');

exports.verifyOrganizationMemberToken = (req, res, next) => {
    //let token = req.headers.token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // console.log('JWT Verif MW');
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized or Token Expired! Login Again!'
            });
        }
        req.organizationMember = decoded;
        next();
    }
    );
};