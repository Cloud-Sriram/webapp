const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');

class Assignment extends Model {}

Assignment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    readonly: true,
  },
  title: DataTypes.STRING,
  points: DataTypes.INTEGER,
  num_of_attempts:DataTypes.INTEGER,
  deadline: DataTypes.DATE,    
  assignment_created: DataTypes.DATE,
  assignment_updated : DataTypes.DATE
}, {
  sequelize,
  modelName: 'assignment',
  timestamps: true, 
  underscored: true
});



module.exports = Assignment;

