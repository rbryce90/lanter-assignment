import { AccessorClass } from "./accessor"
import { FilmSearchRequest, FilmServiceUrls, Film } from "./model"

const dvdAccessor = new AccessorClass(FilmServiceUrls.DVD)
const vhsAccessor = new AccessorClass(FilmServiceUrls.VHS)
const projectorAccessor = new AccessorClass(FilmServiceUrls.PROJECTOR)

async function getFilmsBySearch(excludeDVD: boolean, excludeProjector: boolean, excludeVHS: boolean, sortField: "title" | "releaseYear", sortDirection: "ASC" | "DESC", pageSize: number, currentPage: number) {
    let films: Film[] = []

    if (!excludeDVD) {
        films.concat(await dvdAccessor.getFilmsByParams(sortField, sortDirection, pageSize, currentPage))
    }

    if (!excludeProjector) {
        films.concat(await projectorAccessor.getFilmsByParams(sortField, sortDirection, pageSize, currentPage))
    }
    if (!excludeVHS) {
        films.concat(await vhsAccessor.getFilmsByParams(sortField, sortDirection, pageSize, currentPage))
    }

    return films
}

export async function getFilms(params: FilmSearchRequest) {
    const { currentPage, pageSize, sortField, sortDirection, excludeDVD, excludeProjector, excludeVHS, search } = params

    let films: Film[] = []

    let rawFilms: Film[] = await getFilmsBySearch(excludeDVD, excludeProjector, excludeVHS, sortField, sortDirection, pageSize, currentPage)



    return films
}