const jwt = require("jsonwebtoken");
const admin = require("../models/adminSchema");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            const verify = jwt.verify(token, process.env.secretKey);
            const user = await admin.findOne({ _id: verify._id });

            if (!user) {
                throw new Error('User not found');
            }

            // Set user information on the request object
            req.user = user;

            next(); // Move to the next middleware
        } else {
            throw new Error('No token provided');
        }
    } catch (error) {
        res.status(401).send("Authentication failed");
    }
};

module.exports = auth;
