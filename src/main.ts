const express = require('express')
const cors = require('cors')

import { getMappings } from "./getMappings";
import { META } from "@consumet/extensions"

import db from './db/connect'
import MappingModel from "./db/models/anime";

import chalk from "chalk";
import fs from "fs";


const app = express()

app.use(cors())

app.get('/', (req: any, res: any) => {
    
    res.status(200).json({
        message: "Welcome to the AniMappings API!",
        routes: {
            "/": "This page",
            "/anilist/:anilistId": "Get the Mappings for the given AniList ID",
            "/mal/:malId": "Get the Mappings for the given Mal ID",
            "/trending": "an example integration with a popular anime library consumet - https://github.com/consumet/consumet.ts",
            "/popular": "another example integration with consumet"
        }
    })
})

app.get('/anilist/:id', async(req: { params: { id: number | string }}, res: any) => {
    // 150672
    const id = req.params.id

    if(!id) return res.status(400).json({message: 'Invalid Id'})

    try{
        const data = await getMappings(Number(id))
        res.status(200).json(data)
    }catch(err: any){
        res.status(500).json({error: err.message})
    }
})

app.get('/mal/:id', async(req: { params: { id: number | string }}, res: any) => {
    const id = req.params.id

    if(!id) return res.status(400).json({message: 'Invalid Id'})

    try {
        await db.connect()
        const data = await MappingModel.findOne({ malId: Number(id) })

        if(data && data.length){
            return res.json(data)
        }else{
            return res.status(404).json({message: "Sorry, Couldnt find the MAL id in the database"})
        }
    }catch(err: any){
        res.status(500).json({message: err.message})
    }
})

app.get("/info/:id", async(req: { params: { id: number | string }}, res: any) => {
    const id = req.params.id
    if(!id) return res.status(400).json({message: 'Invalid Id'})

    try {
        const anilist = new META.Anilist()
        const info = await anilist.fetchAnimeInfo(String(id))
        const mappings = await getMappings(Number(id))

        // Remove OG mappings and add current one
        info.mappings && delete info.mappings

        res.status(200).json({
            ...info,
            mappings: mappings
        })
    }catch(error: any){
        console.log(error)
        res.status(500).json({error: "Ran into an error trying to request that info. Please try again later"})
    }
})

app.get('/trending', async(req: any, res: any) => {

    try{
        const daAnime = new META.Anilist()
        const data = await daAnime.fetchTrendingAnime(1, 50)

        res.status(200).json(data)
    }catch(err: any){
        res.status(500).json({error: err.message})                
    }
})

app.get('/popular', async(req: any, res: any) => {

    try{
        const daAnime = new META.Anilist()
        const data = await daAnime.fetchPopularAnime(1, 50)

        res.status(200).json(data)
    }catch(err: any) {
        res.status(500).json({error: err.message})                
    }
})

app.get("/current", async(req: any, res: any) => {

    try {
        await db.connect()
        res.status(200).json({ Total: await MappingModel.count({}) })
    }catch(error: any){
        console.error(error)
        return res.status(500).json({ message: "An error occurred while processing your request" })
    }
})

let lastId = 0;
if(!fs.existsSync("lastId.txt")){
    console.log(chalk.yellow("lastId.txt does not exist. Creating..."))
    fs.writeFileSync("lastId.txt", "0")
    console.log(chalk.green("Created lastId.txt"))
}
let lastIdString = fs.readFileSync("lastId.txt", "utf8")
lastId = isNaN(parseInt(lastIdString)) ? 0 : parseInt(lastIdString)

const PORT = Number(process.env.PORT) || 6969

app.listen(PORT, (() => {
    console.clear()
    console.log("===========================================\n")
    console.log(
        chalk.green`[!]` +
        " Successfully started web server at " +
        chalk.blueBright`http://localhost:${PORT}`
    )
    console.log(
        chalk.blue`[?] ` +
        "Starting crawler at index" +
        chalk.cyanBright` ${lastId}`
    )
    console.log("\n===========================================")
}))
