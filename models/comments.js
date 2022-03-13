const CommentModel = (connection, DataTypes) => {
    return connection.define("comment", {
      id: {
        type: DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
      },
      comment: {
        type: DataTypes.STRING,
        allowNull:false
      },
      isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue: true
      }
    });
  };
  module.exports = CommentModel;
  