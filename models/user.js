const UserModel = (connection, DataTypes) => {
  return connection.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isActive:{
      type:DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
};
module.exports = UserModel;
