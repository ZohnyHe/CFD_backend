'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConstData extends Model {

    static associate({ CaseData }) {
      this.belongsTo(CaseData, { foreignKey: 'caseId', as: 'caseConst' });
    }

    toJSON() {
      return { ...this.get(), constId: undefined, caseId: undefined, createdAt: undefined, updatedAt: undefined }
    }

  };

  ConstData.init({
    constId: {
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    caseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    points: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    faces: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    owners: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    neighbours: {
      type: DataTypes.JSON,
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
    tableName: 'constData',
    modelName: 'ConstData',
  });
  return ConstData;
};