import mongoose from "mongoose";

require('dotenv').config()

const connection = {} as any

async function connect(){
    if(connection.isConnected){
        console.log('Already Connected')
        return;
    }
    if(mongoose.connections.length > 0){
        connection.isConnected = mongoose.connections[0].readyState
        if(connection.isConnected === 1){
            console.log('Using Previous Connection')
            return
        }
        await mongoose.disconnect()
    }
    // @ts-ignore
    const db = await mongoose.connect(vars.DATABASE_URL ?? process.env.DATABASE_URL as string)
    console.log('New Connection')
    connection.isConnected = db.connections[0].readyState
}
async function disconnect() {
    if(connection.isConnected){
        if(process.env.NODE_ENV === 'production'){
            await mongoose.disconnect()
            connection.isConnected = false
        }else{
            console.log('Not Disconnected')
        }
    }
}
const db = {connect, disconnect}

export default db
