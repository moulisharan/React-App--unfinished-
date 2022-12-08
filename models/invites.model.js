module.exports = (sequelize, Sequelize) => {
    const Invites = sequelize.define("invites", {
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
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      usericon: {
        type: Sequelize.STRING
      },
      issent: {
        type: Sequelize.BOOLEAN
      },
    }, {
      tableName: 'invites',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
  
    return Invites;
  };
  