import moment from "moment";
import bcrypt from 'bcrypt';
import UserTableModel from "../models/user-model"; 
import TaskTableModel from "../models/task-model";
import sequelize from "../utilities/database-connect";

const userSeeds = require("../seeds/user-admin.seeds.json");

export const initSeedsIntoDB = async () => {
    
    //init the transaction
    const tscn = await sequelize.transaction();

    try{

        for(let i = 0; i < userSeeds.length; i++){
            const user = userSeeds[i];

            //hash the password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(user.password_hash, salt);

            const userObj = {
                ...user,
                password_hash: hashPassword,
                role: 'ADMIN',
                is_admin: true,
                created_at: moment().utc().toDate()
            }

            //creating the user
            const createdUser:any = await UserTableModel.create(userObj, {transaction: tscn});

            //creating the task and assigning to the user
            const taskObj = {
                title: 'Add users and create tasks',
                description: 'Create task and assigned to users',
                due_date: moment().utc().toDate(),
                status: 'IN-PROGRESS',
                created_at: moment().utc().toDate(),
                // created_by: createdUser.id
                user_id: createdUser.id
            }

            //creating the task
            await TaskTableModel.create(taskObj, {transaction: tscn});
            
        }

        //commit the transaction
        await tscn.commit();
    }
    catch(error:any){
        //rollback the transaction
        await tscn.rollback();
        console.log("Unable to insert the seed data when initiate first time.\n",error);
    }
    finally{
        
        console.info("Seed insertion Process Completed");
    }
}