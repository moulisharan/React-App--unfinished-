module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      roomname: {
        type: Sequelize.STRING
      },
      plantype: {
        type: Sequelize.INTEGER
      },
      islocked: {
        type: Sequelize.BOOLEAN
      },
      isopened: {
        type: Sequelize.BOOLEAN
      },
      usericon: {
        type: Sequelize.STRING
      },
      ispaid: {
        type: Sequelize.INTEGER
      },
      paiddate: {
        type: Sequelize.DATE
      },
      roomlogo: {
        type: Sequelize.STRING
      },
    }, {
      tableName: 'users',
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      underscored: true
    });
  
    return Users;
  };
  