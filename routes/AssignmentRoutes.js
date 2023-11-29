const express = require('express');
const router = express.Router();
const Assignment = require('../models/AssignmentModels');
const User = require('../models/UserModels');
const { validateUser } = require('../controllers/UserControllers')
const bcrypt=require('bcrypt')
const app = express();
app.use(express.json());
const MappingModels = require('../models/MappingModels');
const { request } = require('express');
const metrics = require('../metrics/metrics');
const logger = require('../logger/logs');
const Submission = require('../models/SubmissionModels');
const AWS =  require('aws-sdk');


// . Get request to get User Validation
 
router.get('/', async (req, res) => {
    metrics.increment('myendpoint.get.method');
    // if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    //     logger.warn('GET / - Bad Request: This endpoint does not accept query parameters or request body.');
    //     return res.status(400).json({ error: 'Bad Request: This endpoint does not accept query parameters or request body.' });
    // }
    if (req.headers['content-length'] || req.headers['transfer-encoding'] || Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        logger.warn("GET / - Bad Request: This endpoint does not accept query parameters or request body.");
        return res.status(400).json({ error: 'Bad Request: This endpoint does not accept query parameters or request body.'});
    }
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            logger.warn('GET / - Unauthenticated access attempt.');
            return res.status(401).json({ error: "Unauthenticated" });
        }

        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');

        const user = await User.findOne({ where: { email } });
        if (!user) {
            logger.error('GET / - Authentication failed. User not found.');
            return res.status(401).json({ error: 'Authentication failed. User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.error('GET / - Authentication failed. Invalid password.');
            return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
        }
        const assignments = await Assignment.findAll();
        logger.info('GET / - Assignments fetched successfully.');

        res.status(200).json(assignments);
    } catch (error) {
        logger.error(`GET / - Error fetching data: ${error.message}`);
        res.status(403).json({ error: 'Unable to fetch data' });
    }
});
 
 
// Method to Post Data into the server
router.post('/', async (req, res) => {
    metrics.increment('myendpoint.post.method');
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            logger.warn('POST / - Authorization header is missing.');
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
 
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');
 
        const user = await User.findOne({ where: { email } });
        if (!user) {
            logger.error('POST / - Authentication failed. User not found.');
            return res.status(401).json({ error: 'Authentication failed. User not found.' });
        }
 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.error('POST / - Authentication failed. Invalid password.');
            return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
        }
 
        const { title, points, num_of_attempts, deadline } = req.body;
        const numericPoints = Number(points);
        const numericNumOfAttempts = Number(num_of_attempts);
        if (!Number.isInteger(numericNumOfAttempts)) {
            logger.error('POST / - Number of attempts should be an integer.');
            return res.status(400).json({ error: 'Number of attempts should be an integer.' });
        }
        if(!(points > 0 && points <= 10)) {
            logger.error('POST / - Numeric Points should be an integer.');
            return res.status(400).json({error: 'The points should be between 1 and 10 (inclusive)'});
        }

        const numeric_Points = Number(points);
        if (!Number.isInteger(numeric_Points)) {
            logger.error('POST / - Points should be an integer.');
            return res.status(400).json({ error: 'Points should be an integer.' });
        }

        // const numericNumOfAttempts = Number(num_of_attempts);
        // if (!Number.isInteger(numericNumOfAttempts)) {
        //     return res.status(400).json({ error: 'Number of attempts should be an integer.' });
        // }

        if (!deadline || isNaN(new Date(deadline).getTime())) {
            logger.error('POST / - Datetime should be valid.');
            return res.status(400).json({ error: 'Deadline should be a valid datetime string.' });
        }

        const assignment = await Assignment.create({
            title,
            points,
            num_of_attempts,
            deadline,
            assignment_created : new Date(),
            assignment_updated : new Date()
 
        });
        logger.info(`POST / - Assignment created with ID: ${assignment.id}`);
        const mappedAssignment = await MappingModels.create
            ({
 
                userId : user.id,
                assignmentId : assignment.id
 
            })
 
        res.status(201).json(assignment);
    } catch (error) {
        logger.error(`Error creating assignment: ${error.message}`);
        res.status(400).json({ error: 'Bad request' });
    }
   
});
 
// This is the put method
router.put('/:id', async (req, res) => {
    metrics.increment('myendpoint.put.method');
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            logger.warn('Put / - U: This endpoint does not accept query parameters or request body.');
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
 
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');
        const user = await User.findOne({ where: { email } });
        if (!user) {
            logger.error(`PUT request: User not found`);
            return res.status(401).json({ error: 'Authentication failed. User not found.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.error(`PUT request: Password Invalid `);
            return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
        }
 
        const assignmentId = req.params.id;
        const assignment = await Assignment.findByPk(assignmentId);
 
        const mapped_assignment_id = (await MappingModels.findOne({ where : {assignmentId: assignmentId }})).userId;
        console.log(mapped_assignment_id);
        // Ensure the assignment exists
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
           
        }
 
        // Check if the assignment belongs to the authenticated user
        if (mapped_assignment_id !== user.id) {   // Assuming your Assignment model has a foreign key of userId linked to User model
            return res.status(403).json({ error: 'You do not have permission to update this assignment.' });
        }
 
        // Assignment id should match the same id as the mappingmodels table id
        //once that is matched it should get the user table id
        
 
        const { title, points, num_of_attempts, deadline } = req.body;
        if (!(points > 0 && points <= 10)) {
            return res.status(400).send();
        }
 
        assignment.title = title;
        assignment.points = points;
        assignment.num_of_attempts = num_of_attempts;
        assignment.deadline = deadline;
 
        await assignment.save();
        logger.info(`PUT /${req.params.id} - Assignment updated successfully.`);
        res.status(204).send();
    } catch (error) {
        logger.error(`Error updating assignment: ${error.message}`);
        res.status(403).json({ error: 'Forbidden' });
    }
});
 
 
// Delete Assignment for a particular id
router.delete('/:id', async (req, res) => {
    metrics.increment('myendpoint.delete.method');
    if (req.headers['content-length'] || req.headers['transfer-encoding'] || Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        logger.error("DELETE / - Bad Request: This endpoint does not accept query parameters or request body.");
        return res.status(400).json({ error: 'Bad Request: This endpoint does not accept query parameters or request body.'});
    }
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            logger.warn(`DELETE request: Authorization missing`);
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
 
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');
 
        const user = await User.findOne({ where: { email } });
        if (!user) {
            logger.error(`Delete request: User Invalid `);
            return res.status(403).json({ error: 'Authentication failed. User not found.' });
        }
 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.error(`Delete request: Password Invalid `);
            return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
        }
 
        const assignmentId = req.params.id;
        const assignment = await Assignment.findByPk(assignmentId);
        
        // Ensure the assignment exists
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
 
        const mapped_assignment_id = (await MappingModels.findOne({ where : {assignmentId: assignmentId }})).userId;
 
        // Check if the assignment belongs to the authenticated user
        if (mapped_assignment_id !== user.id) {
            logger.warn(`DELETE Request, we cannot update the assignment.`);
            return res.status(403).json({ error: 'You do not have permission to delete this assignment.' });
        }
 
        await assignment.destroy();
        logger.info(`DELETE /${req.params.id} - Assignment deleted successfully.`);
        res.status(204).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        logger.error(`DELETE /${req.params.id} - Error deleting assignment: ${error.message}`);
        res.status(400).json({ error: 'Bad request' });
    }
});
 
 
// New GET request for fetching an assignment by ID
router.get('/:id', async (req, res) => {
    metrics.increment('myendpoint.getbyId.method');
    if (req.headers['content-length'] || req.headers['transfer-encoding'] || Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        logger.warn("GETbyID / - Bad Request: This endpoint does not accept query parameters or request body.");
        return res.status(400).json({ error: 'Bad Request: This endpoint does not accept query parameters or request body.'});
    }
    try {

        const authHeader = req.headers['authorization'];
 
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({error: "Unauthenticated" });
        }
 
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');
 
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(403).json({ error: 'Authentication failed. User not found.' });
        }
 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ error: 'Authentication failed. Invalid password.' });
        }
 
        const assignmentId = req.params.id;
        const assignments = await Assignment.findByPk(assignmentId);
 
        // Check if assignment is null and return a 403 Forbidden if it is
        if (!assignments) {
            return res.status(403).json({ error: 'Assignment not found' });
        }
        logger.info(`GET /${req.params.id} - Assignment fetched successfully.`);
        res.status(200).json(assignments);
    } catch (error) {
        logger.error(`Error fetching data: ${error.message}`);
        res.status(403).json({ error: 'Unable to fetch data' });
    }
});

router.post('/:id/submission', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            logger.warn('POST /:id/submission - Unauthenticated access attempt.');
            return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
        }

        // Decoding credentials from the Basic Auth header
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');

        // Authenticating the user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            logger.error('POST /:id/submission - Authentication failed. User not found.');
            return res.status(401).json({ error: 'Authentication failed. User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.error('POST /:id/submission - Authentication failed. Invalid password.');
            return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
        }

        // User is authenticated, proceed with the submission logic
        const assignmentId = req.params.id;
        const { submissionUrl } = req.body;

        // Fetch assignment and check if it exists
        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) {
            logger.warn(`Assignment not found for ID: ${assignmentId}`);
            return res.status(404).json({ error: 'Assignment not found.' });
        }

        // Check if the deadline has passed
        if (new Date(assignment.deadline) < new Date()) {
            logger.warn(`Submission deadline has passed for assignment ID: ${assignmentId}`);
            return res.status(403).json({ error: 'Submission deadline has passed.' });
        }

        // Check if user has not exceeded retries
        const submissions = await Submission.findAll({ where: { userId: user.id, assignmentId } });
        if (submissions.length >= assignment.num_of_attempts) {
            logger.warn(`Maximum submission attempts exceeded for user ID: ${user.id} and assignment ID: ${assignmentId}`);
            return res.status(403).json({ error: 'Maximum submission attempts exceeded.' });
        }

        // Create submission
        const submission = await Submission.create({
            userId: user.id,
            assignmentId,
            submissionUrl,
            submissionDate: new Date(),
            submissionUpdated: new Date()
        });

        // Publish to SNS Topic (placeholder)
        // publishToSNSTopic({ email: user.email, submissionUrl });

        res.status(201).json({
            id: submission.id,
            assignment_id: assignment.id,
            submission_url: submission.submissionUrl,
            submission_date: submission.submissionDate,
            submission_updated: submission.submissionUpdated
        });
    } catch (error) {
        console.error(`Error details:`, error);
        logger.error(`Error creating submission: ${error.message}`);
        res.status(400).json({ error: 'Bad request' });
    }
});



 
module.exports = router;