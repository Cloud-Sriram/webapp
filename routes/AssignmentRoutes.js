const express = require('express');
const router = express.Router();
const Assignment = require('../models/AssignmentModels');
const User = require('../models/UserModels');
const { validateUser } = require('../controllers/UserControllers')
const bcrypt=require('bcrypt')
const app = express();
app.use(express.json());
const MappingModels = require('../models/MappingModels');

// . Get request to get User Validation

router.get('/', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Authorization header is missing or incorrect' });
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

        // Extracting only the necessary fields for privacy reasons (omitting the password field)
        const userDetails = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            account_created: user.account_created,
            account_updated: user.account_updated
        };

        res.status(200).json(userDetails);
    } catch (error) {
        console.error(`Error fetching user details: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Method to Post Data into the server
router.post('/', async (req, res) => {
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

        const { title, points, num_of_attempts, deadline } = req.body;
        if(!(points > 0 && points <= 10)) {
            return res.status(400).json({error: 'The points should be between 1 and 10 (inclusive)'});
        }
        const assignment = await Assignment.create({
            title,
            points,
            num_of_attempts,
            deadline,
            assignment_created : new Date(),
            assignment_updated : new Date()

        });

        const mappedAssignment = await MappingModels.create
            ({

                userId : user.id,
                assignmentId : assignment.id

            }) 

        res.status(201).json(assignment);
    } catch (error) {
        console.error(`Error creating assignment: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
   
});

// This is the put method
router.put('/:id', async (req, res) => {
    console.log('Request Body', req.body);
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
            return res.status(403).json({ error: 'Authentication failed. Invalid password.' });
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

        res.status(204).send();
    } catch (error) {
        console.error(`Error updating assignment: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Delete Assignment for a particular id
router.delete('/:id', async (req, res) => {
    console.log('Request to delete assignment with ID', req.params.id);
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
        res.status(204).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error(`Error deleting assignment: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// New GET request for fetching an assignment by ID
router.get('/:id', async (req, res) => {
    try {
        const assignmentId = req.params.id;
        const assignment = await Assignment.findByPk(assignmentId);

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.status(200).json(assignment);
    } catch (error) {
        console.error(`Error fetching assignment by ID: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Remaining methods should return 405
router.all('/', (req, res) => {
    res
      .status(405)
      .header('Cache-Control', 'no-cache, no-store, must-revalidate')
      .json();
  });

module.exports = router;
