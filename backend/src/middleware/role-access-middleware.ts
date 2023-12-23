import url from 'url';
import { Sequelize } from 'sequelize';
import TaskTableModel from '../models/task-model';
import UserTableModel from '../models/user-model';

const roleAuchCheck = async(req:any, res: any, next:any) => {
    try{
        
        if(req.role == 'ADMIN'){
            return next();
        }

        //check if the user is the owner of the task
        const task:any = await TaskTableModel.findOne({where:{id:req.params.id, is_deleted:false}, raw:true, attributes:["id", "user_id"]});
        if(!task || task == undefined || task == null){
            throw new Error("Denied priviledge!!");
        }

        if(task.user_id == req.keyId){
            return next();
        }

        throw new Error("Denied priviledge!");
    }
    catch(error:any){
        console.log("Error in roleAuchCheck middleware", error);
        return res.status(403).send({message: error.message});
    }
};

export default roleAuchCheck;