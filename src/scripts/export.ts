import db from '../db/connect'
import MappingModel from '../db/models/anime';

import fs from "fs";
import chalk from "chalk";

async function convertTablesToJSON() {
  await db.connect()
  const rows = await MappingModel.find({})

  const json = JSON.stringify(rows)
  fs.writeFileSync("export.json", json)

  // You can do whatever you want with the JSON here, e.g. write it to a file.

  await db.disconnect()
  console.log(chalk.green("Created export.json Done!"))
  process.exit(1)
}
convertTablesToJSON().catch((error) => {
  console.error(error)
  process.exit(1)
})
