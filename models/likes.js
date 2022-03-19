const LikesModel = (db, DataTypes) => {
  return db.define("post_likes", {
    id: {
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    post_id: {
      type:DataTypes.UUID,
      allowNull: false
    }
  });
};
module.exports = LikesModel;
