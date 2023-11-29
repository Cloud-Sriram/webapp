const Submission = require('../models/SubmissionModels'); // Ensure correct path
const Assignment = require('../models/AssignmentModels'); // Ensure correct path
const logger = require('../logger/logs'); // Ensure correct path
const publishMessageToSNS = require('../aws-sns');

class SubmissionController {

    static async createSubmission(req, res) {
        try {
            const user = req.user; // Assuming this is set by your authentication middleware
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
                // userId: user.id,
                assignmentId,
                submissionUrl,
                submissionDate: new Date(),
                submissionUpdated: new Date()
            });

            console.log("this is fdata for assignment", assignment);

            const dataForSnsMessage = {
                submissionUrl: submissionUrl,
                user_email: user.email, // Assuming email is a direct property of the user object
                assignmentID: assignmentId,
                assignment_Name: assignment.title,
                submissionID: submission.id
            };
            await publishMessageToSNS(dataForSnsMessage);
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
    }
}

module.exports = SubmissionController;
