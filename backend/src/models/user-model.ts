import { DataTypes } from "sequelize";
import sequelize from "../utilities/database-connect";

const UserTableModel = sequelize.define('user_table',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV1,
        allowNull:false,
        primaryKey:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    username:{
        type:DataTypes.STRING,
    },
    role:{
        type:DataTypes.STRING,
        defaultValue:'USER'
    },
    is_admin:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    password_hash:{
        type:DataTypes.STRING,
    },
    temporary_password_hash:{
        type:DataTypes.STRING,
    },
    temporary_password_expiry_date:{
        type:DataTypes.DATE,
        defaultValue:null
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    created_at:{
        type:DataTypes.DATE,
        defaultValue:null,
    },
    created_by:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    updated_at:{
        type:DataTypes.DATE,
        defaultValue:null
    },
    updated_by:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    is_deleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    deleted_at:{
        type:DataTypes.DATE,
        defaultValue:null
    },
    deleted_by:{
        type:DataTypes.STRING,
        defaultValue:null
    }
},{
    timestamps: false
});

/**
 * @note
 * please check Server.ts file
 * there are one to many relationship between user and task
 */

export default UserTableModel;