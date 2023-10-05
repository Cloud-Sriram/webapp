const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const User = require('../models/UserModels'); // Adjust the path to your actual User model file

class MappingModels extends Model {}

MappingModels.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        readonly: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    assignmentId: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'MappingModel', // singular because it's a model name
    timestamps: true,
    underscored: true
});

module.exports = MappingModels;
