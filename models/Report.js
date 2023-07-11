const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {

  const Report = Sequelize.define("Report", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id"
      }
    },
    reasonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "ReportReasons",
        key: "id"
      }
    },

    details: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id"
      }
    },

    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "Posts",
        key: "id"
      }
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
      references: {
        model: "Conversations",
        key: "id"
      }
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  Report.associate = (db) => {
    Report.belongsTo(db.ReportReason, {
      as: "reason",
      foreignKey: "reasonId"
    });

    Report.belongsTo(db.User, {
      as: "reporter",
      foreignKey: "reporterId"
    });
    Report.belongsTo(db.User, {
      as: "user",
      foreignKey: "userId"
    });

    Report.belongsTo(db.Post, {
      as: "post",
      foreignKey: "postId"
    });

    Report.belongsTo(db.Conversation, {
      as: "conversation",
      foreignKey: "conversationId"
    });
  }

  return Report;
}