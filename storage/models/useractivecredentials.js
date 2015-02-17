/**
 * Created by dhc on 15-2-17.
 */

module.exports = function(sequelize, DataTypes) {
    var UserActiveCredentials = sequelize.define('UserActiveCredentials', {
        activeID: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1
        }
    }, {
        timestamp: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                UserActiveCredentials.belongsTo(models.Users, {
                    foreignKey: 'uid'
                });
            }
        }
    });


    return UserActiveCredentials;
};