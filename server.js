const express = require('express');
const app = express();
const sequelize = require('./config/dbconfig');
const { loadCSV } = require('./util/csvLoader');
const { router: authenticationRoutes } = require('./util/Authentication.js');
const assignmentRoutes = require('./routes/AssignmentRoutes');
const User = require('./models/UserModels')
const bcrypt = require('bcryptjs');
const {router: Assignment} = require('./routes/AssignmentRoutes');
const assignment_Routes = require('./routes/AssignmentRoutes');
const db = require('./mydb.js');
const logger = require('./logger/logs')
app.use(express.json());
app.use('/v1/assignments', assignment_Routes);


//Assignment-1 Related Work

app.get('/healthz', (req, res) => {
    logger.info("This is a healthz checkpoint"); 
    if((Object.keys(req.body).length > 0) || (Object.keys(req.query).length > 0)){ 
      return res.status(400).json();
      }
  db.checkDbConnection((err, isConnected) => {
    if (err || !isConnected) {
      res
        .status(503)
        .header('Cache-Control', 'no-cache, no-store, must-revalidate')
        .json();
    } else {
      res
        .status(200)
        .header('Cache-Control', 'no-cache, no-store, must-revalidate')
        .json();
    }
  });
});
app.all('/healthz', (req, res) => {
  logger.info("This is a checkout where you 405, since the method isn't found"); 
  res
    .status(405)
    .header('Cache-Control', 'no-cache, no-store, must-revalidate')
    .json();
});

const port = process.env.PORT || 8081;


const initializeApp = async () => {
    try {
        // Sync the models with the database.
        await sequelize.sync({ alter: true });
        
        const usersFromCSV = await loadCSV('./opt/users.csv'); // Provide the absolute path to your CSV file here.

        for (let user of usersFromCSV) {
            // Add logic to insert users into the database if they don't already exist.
            const existingUser = await User.findOne({ where: { email: user.email } });
            if (!existingUser) {
                // Insert user into the database.
                user.password = await bcrypt.hash(user.password, 10); 
                await User.create(user);
            }
        }

        // Start the server after loading the CSV and other initial tasks.
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error initializing the application:', error);
    }
};

initializeApp();

module.exports = app;


