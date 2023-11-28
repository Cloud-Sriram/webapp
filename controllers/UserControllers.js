const User = require('../models/UserModels');
const bcrypt = require('bcryptjs');
exports.createUser = async (req, res) => {
    try {

        const { id, first_name, last_name, email, password, account_created, account_updated } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({ 
            id,
            first_name,
            last_name,
            email, 
            password: hashedPassword, 
            account_created, 
            account_updated  
        });
        const userData = user.get({ plain: true });
        delete userData.password;

        res.status(201).json(userData);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const validateUser = async (authorizationHeader) => {
    try {
      const base64Credentials = authorizationHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');
      const user = await User.findOne({ where: { email: username } });
      if (!user) {
        return null;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        return user;

      } else {
        return 0;
      }

    } catch (error) {
      console.error('Error while validating user:', error);
      return 0;
    }
  };

  module.exports = {
    validateUser
};