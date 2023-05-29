import db from './db/connect'
import MappingModel from './db/models/anime'

import axios from "axios"

import chalk from "chalk"

import { ITitle } from "@consumet/extensions/dist/models"

import {
  kitsu,
  thetvdb,
  zoro,
  gogo,
  tmdb,
  livechart,
  Malsync,
  fribbList,
} from "./mappings"

export const getMappings = async(anilistId: number) => {
  await db.connect()
  const existeMappings = await MappingModel.findOne({ anilistId: Number(anilistId) })
  if(existeMappings){
    console.log("Mappings already exist for this AniList ID " + anilistId)
    return existeMappings
  }

  try {
    const { data } = await axios.post("https://graphql.anilist.co/", {
      query: `{
                Media(id:${anilistId}) {
                  id
                  idMal
                  format
                  startDate{
                    year
                  }
                  title {
                    romaji
                    english
                    native
                    userPreferred
                  }
                  synonyms
                }
              }`,
    })

    const anime = data?.data.Media;
    const aniId = Number(anime.id);
    const fribb = await fribbList(anime.idMal as number);
    const malsync = await Malsync(anime.idMal as number);
    const tvdb = await thetvdb(
      ((anime.title as ITitle).english as string) ?? ((anime.title as ITitle).romaji as string),
      anime.startDate.year ?? null,
      anime.format
    )
    await Promise.all([ fribb, tvdb ])
    
    await MappingModel.create({
      anilistId: aniId,
      title: {
        english: anime.title.english ?? null,
        romaji: anime.title.romaji ?? null,
        native: anime.title.native ?? null,
      },
      malId: anime.idMal,
      zoroId:
        anime.idMal !== undefined && malsync && malsync.Zoro
          ? (Object.values(malsync.Zoro)[0] as any).url.replace(
              "https://zoro.to/",
              ""
            )
          : await zoro(
            ((anime.title as ITitle).english as string) ??
              (anime.title as ITitle).romaji
          ),
      gogoanimeId:
        anime.idMal !== undefined && malsync && malsync.Gogoanime
          ? (Object.values(malsync.Gogoanime)[0] as any).identifier
          : await gogo(
            ((anime.title as ITitle).romaji as string) ??
              (anime.title as ITitle).english
          ),
      nineanimeId:
        anime.idMal !== undefined && malsync && malsync["9anime"]
          ? (Object.values(malsync["9anime"])[0] as any).url.replace(
              "https://9anime.pl/watch/",
              ""
            )
          : null,
      Marin:
        anime.idMal !== undefined && malsync && malsync.Marin
          ? (Object.values(malsync.Marin)[0] as any).identifier
          : null,
      animepahe:
        anime.idMal !== undefined && malsync && malsync.animepahe
          ? (Object.values(malsync.animepahe)[0] as any).identifier
          : null,
      anilist: anime,
      kitsu: await kitsu(
        ((anime.title as ITitle).romaji as string) ?? (anime.title as ITitle).english
      ),
      thetvdb: tvdb,
      tmdb: tvdb ? await tmdb(tvdb.id, anime.format) : null,
      anidb: fribb?.anidb_id,
      anisearch: fribb?.anisearch_id,
      livechart: fribb?.livechart_id ?? (await livechart(String((anime.title as ITitle).romaji))),
    })
    .then(async () => {
      console.log(chalk.green`[+] Mappings for ${((anime.title as ITitle).romaji as string) ?? (anime.title as ITitle).english} have been added`)
    })
    return await MappingModel.findOne({ anilistId: aniId })
  }catch(error: any){
    if(error instanceof Error){
      if(error.message === "Media not found"){
        return {
          message:
            "An error occurred while processing your request: Media not found.",
          error: error.message,
        }
      }
      console.log(error.message)
      return{
        message:
          "An error occurred while processing your request. Please make sure this is a valid AniList ID",
      }
    }
  }
}

// (async() => {
// 	await MappingModel.deleteMany()
// 	await getMappings(150672)
// 	console.log(await getMappings(150672))
// })()
