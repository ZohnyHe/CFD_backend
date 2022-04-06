'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OutputData extends Model {

    static associate({ CaseData }) {
      this.belongsTo(CaseData, { foreignKey: 'casesId', as: 'caseOutput' });
    }

    toJSON() {
      return { ...this.get(),
        outputId: undefined, caseId: undefined, createdAt: undefined, updatedAt: undefined }
    }
  };
  OutputData.init({
    outputId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    caseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    timeStep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    temperature: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    velocity: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    carbonDioxide: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    oxygen: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'outputData',
    modelName: 'OutputData',
  });
  return OutputData;
};