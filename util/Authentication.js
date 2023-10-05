const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModels');
const router = express.Router();

const JWT_SECRET = 'Bharat1234#'; // NOTE: Always store secrets in environment variables.
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: 'Authentication failed.' });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
        return res.status(401).json({ error: 'Authentication failed.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '1h'
    });

    res.status(200).json({ token, userId: user.id });
});

// Middleware to check if the request has a valid token
const verifyToken = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: 'Token is invalid.' });
    }
    if (!decodedToken) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }
    req.userId = decodedToken.userId;
    next();
};

const currUserAssignments = async (user) => {
    try {
        const assignments = await Assignment.findAll({
            where: {
                user_id: user.id // Assuming that your user object has an 'id' attribute
            },
            attributes: ['id'] // We only need IDs of assignments for this user
        });
        
        // Convert array of objects to array of IDs
        const assignmentIds = assignments.map(assignment => assignment.id);
        
        return assignmentIds;
    } catch (error) {
        console.error(`Error retrieving assignments for user: ${error.message}`);
        return []; // Return an empty array on error
    }
}

module.exports = {
    router,
    verifyToken,
    currUserAssignments
};
