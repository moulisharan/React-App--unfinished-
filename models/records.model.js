module.exports = (sequelize, Sequelize) => {
    const Records = sequelize.define("records", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING
      },
      filename: {
        type: Sequelize.STRING
      },
      filesize: {
        type: Sequelize.STRING
      },
    }, {
      tableName: 'records',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
  
    return Records;
  };
  