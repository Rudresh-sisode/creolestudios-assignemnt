import { debug } from "util";
import app from "./app";
import http from "http";

require('dotenv').config();

import sequelize from "./utilities/database-connect";
import UserTableModel from "./models/user-model";
import TaskTableModel from "./models/task-model";

import * as seedsChecks from "./seeds/seed-import-transcription";


function normalizePort(val: string): number | string | boolean {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


const onError = (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  
const onListening = (): void => {
const addr = server.address();
const bind = typeof port === "string" ? "pipe " + port : "port " + port;
debug("Listening on " + bind);
};
  
const port = normalizePort(process.env.PORT || "8080");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);


/**
 * @description
 * Table associativity below (Basically primary - foreign key association/relation).
 */

UserTableModel.hasMany(TaskTableModel,{constraints:true,onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:'user_id'});
TaskTableModel.belongsTo(UserTableModel,{foreignKey:'user_id'});

//use sync({force:true}) to drop all tables and create new ones
//use sync({alter:true}) to alter the tables (add/remove columns)
sequelize.sync({alter:true}).then(async (_)=>{

    /**
     * @description
     * Adding seeds into the database
     */
    const isUserAvailable = await UserTableModel.findOne({where:{is_deleted:false,is_active:true},raw:true}); 
    if(!isUserAvailable){
        await seedsChecks.initSeedsIntoDB();
    }
  
    console.log("\n***************************************");
    console.log(`***\tserver port ${port}\t*******`);
    server.listen(port);
    console.info("***\tserver successfully started! **");
    console.log("***************************************");
  }).catch(err=>{
    console.error(`~unable to start server ${err}~`);
  });
  