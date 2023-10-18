const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');

class Assignment extends Model {}

Assignment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    readonly: true,
  },
  
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  num_of_attempts: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },

  assignment_created: DataTypes.DATE,

  assignment_updated: DataTypes.DATE
}, {
  sequelize,
  modelName: 'assignment',
  timestamps: true, 
  underscored: true
});

module.exports = Assignment;
