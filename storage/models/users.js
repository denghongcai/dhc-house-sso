/**
 * Created by dhc on 15-2-17.
 */

module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define('Users', {
        uid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        originIP: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Users.hasOne(models.UserActiveCredentials, {
                    as: 'ActiveCredential',
                    onDelete: 'CASCADE',
                    foreignKey: 'uid'
                });
            }
        }

    });

    return Users;
};