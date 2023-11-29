// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/dbconfig');
// //const sequelize = require(''); // Import your database configuration

// class Submission extends Model {}

// Submission.init({
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true
//     },
//     assignmentId: {
//         type: DataTypes.UUID,
//         references: {
//             model: 'assignments', // Name of the assignments table
//             key: 'id'
//         },
//         allowNull: false
//     },
//     userId: {
//         type: DataTypes.UUID,
//         references: {
//             model: 'users', // Name of the users table
//             key: 'id'
//         },
//         allowNull: false
//     },
//     submissionUrl: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     submissionDate: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     },
//     submissionUpdated: {
//         type: DataTypes.DATE
//     }
// }, {
//     sequelize,
//     modelName: 'submission',
//     timestamps: false // Set to true if you want Sequelize to automatically manage createdAt and updatedAt
// });

// module.exports = Submission;
