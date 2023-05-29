import { Schema, models, model } from 'mongoose'

type Anime = {
    title: JSON,
    anilistId: Number,
    malId?: Number,
    zoroId?: JSON,
    gogoanimeId?: JSON,
    nineanimeId?: string,
    Marin?: string,
    animepahe?: string,
    anilist?: JSON,
    cronchyId?: JSON,
    kitsu?: JSON,
    thetvdb?: JSON,
    tmdb?: JSON,
    anidb?: JSON,
    anisearch?: JSON,
    livechart?: JSON
}

const AnimeSchema = new Schema<Anime>({
    title: JSON,
    anilistId: { type: 'number', unique: true },
    malId: { type: 'number', unique: true },
    zoroId: JSON,
    gogoanimeId: JSON,
    nineanimeId: String,
    Marin: String,
    animepahe: String,
    anilist: JSON,
    kitsu: JSON,
    thetvdb: JSON,
    tmdb: JSON,
    anidb: JSON,
    anisearch: JSON,
    livechart: JSON
})


const MappingModel = models?.Mappings || model('Mappings', AnimeSchema)

export default MappingModel