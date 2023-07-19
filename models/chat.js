const ChatModel = (connection, DataTypes) => {
    return connection.define("chats", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        sender_id: {
            type: DataTypes.UUID,
            allowNull: false,
            foreignKey: true
        },
        receiver_id: {
            type: DataTypes.UUID,
            allowNull: false,
            foreignKey: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    }
    );
};
module.exports = ChatModel;
