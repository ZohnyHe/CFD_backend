'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CaseData extends Model {

    static associate({ ConstData, OutputData }) {
      this.hasMany(ConstData, { foreignKey: 'casesId', as: 'caseConst' })
      this.hasMany(OutputData, { foreignKey: 'casesId', as: 'caseOutput' });
    }

    toJSON() {
      return { ...this.get(),
        caseId: undefined, userName: undefined }
    }
  };
  CaseData.init({
    caseId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    caseName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'caseData',
    modelName: 'CaseData',
  });
  return CaseData;
};