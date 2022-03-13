module.exports = (connection, DataTypes) => {
  return connection.define("post", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    read: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    user_id:{
      type: DataTypes.UUID,
      allowNull:false
    },
    isActive:{
      type:DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
};
