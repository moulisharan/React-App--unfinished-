module.exports = (sequelize, Sequelize) => {
    const Records = sequelize.define("records", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      description: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      },
      filesize: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'records',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
  
    return Records;
  };
  