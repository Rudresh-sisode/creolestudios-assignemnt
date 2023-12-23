require('dotenv').config();
import pgtools from 'pgtools';

pgtools.createdb({
    //following is the name of the database you want to create
    user: process.env.PG_ADMIN_USER as string,
    //following is the password for your postgresql server
    password: process.env.PG_ADMIN_PASS as string,
    //following is the port for your postgresql server(usually it's the same)
    port: 5432,
    //following is the host for your postgresql server(usually it's the same)
    host: 'localhost'
},process.env.DATABASE_NAME as string)
.then(res =>{
    //if database is created successfully it will print following message
    console.info("DB created (Database Created Successfully)\n ", res)
})
.catch(err=>{
    //if any error occured while creating database, it will print following error
    console.warn("DATABASE can't be created, Add it manually.\n ERROR", err);
    process.exit(-1);
})
.finally(()=>{
    console.info("Process Completed");
    process.exit(0);
})



