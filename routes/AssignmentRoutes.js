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
const logger = require('../logger/logs')
 
// . Get request to get User Validation
 
router.get('/', async (req, res) => {
    metrics.increment('myendpoint.healthz.http.get');
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        logger.warn('GET / - Bad Request: This endpoint does not accept query parameters or request body.');
        return res.status(400).json({ error: 'Bad Request: This endpoint does not accept query parameters or request body.' });
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
// Method to Post Data into the server
router.post('/', async (req, res) => {
    metrics.increment('myendpoint.healthz.http.post');
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
 
        // Your validation logic here
        const assignment = await Assignment.create({ /* assignment data */ });
        logger.info(`POST / - Assignment created with ID: ${assignment.id}`);
 
        res.status(201).json(assignment);
    } catch (error) {
        logger.error(`POST / - Error creating assignment: ${error.message}`);
        res.status(400).json({ error: 'Bad request' });
    }
});

 
// This is the put method
router.put('/:id', async (req, res) => {
    metrics.increment('myendpoint.healthz.http.put');
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
 
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed. User not found.' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
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
    metrics.increment('myendpoint.healthz.http.delete');
    if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
        return res.status(400).json({ error: 'Bad Request: This endpoint does not accept query parameters or request body.' });
    }
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
 
        const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');
 
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(403).json({ error: 'Authentication failed. User not found.' });
        }
 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
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
    metrics.increment('myendpoint.healthz.http.getbyId')
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
 
 
 
// Remaining methods should return 405
router.all('/', (req, res) => {
    metrics.increment('myendpoint.healthz.http.all');
    logger.warn('ALL / - Method not allowed.');
    res
      .status(405)
      .header('Cache-Control', 'no-cache, no-store, must-revalidate')
      .json();
  });
 
module.exports = router;