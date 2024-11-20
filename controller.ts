import { AccessorClass } from "./accessors/accessor"
import { FilmSearchRequest, FilmServiceUrls, Film, CursorType, FilmType, SortFieldType, DirectionType } from "./model"

const dvdAccessor = new AccessorClass(FilmServiceUrls.DVD)
const vhsAccessor = new AccessorClass(FilmServiceUrls.VHS)
const projectorAccessor = new AccessorClass(FilmServiceUrls.PROJECTOR)

function enhanceFilmsWithTypeAnd(films: Film[], type: FilmType, cursor?: number) {
    let count: number = cursor || 0

    return films.map(film => {
        const transformed = {
            ...film,
            type,
            index: count,
        }
        count++
        return transformed
    });
}

async function getFilmsBySearch(params: FilmSearchRequest) {
    let films: Film[] = []
    const sortField = params.sortField
    const sortDirection = params.sortDirection
    const pageSize = params.pageSize
    const cursor: CursorType | undefined = params?.cursor
    const excludeDVD = params.excludeDVD
    const excludeProjector = params.excludeProjector
    const excludeVHS = params.excludeVHS

    if (!excludeDVD) {
        const filmData: Film[] = await dvdAccessor.getFilmsByParams(sortField, sortDirection, pageSize, cursor?.dvd)
        const transformedFilms = enhanceFilmsWithTypeAnd(filmData, FilmType.DVD)
        films = films.concat(transformedFilms as any)
    }

    if (!excludeProjector) {
        const filmData = await projectorAccessor.getFilmsByParams(sortField, sortDirection, pageSize, cursor?.projector)
        const transformedFilms = enhanceFilmsWithTypeAnd(filmData, FilmType.PROJECTOR)
        films = films.concat(transformedFilms as any)
    }

    if (!excludeVHS) {
        const filmData = await vhsAccessor.getFilmsByParams(sortField, sortDirection, pageSize, cursor?.vhs)
        const transformedFilms = enhanceFilmsWithTypeAnd(filmData, FilmType.VHS)
        films = films.concat(transformedFilms as any)
    }
    return films
}

function sortFilms(films: any[], sortField: SortFieldType, sortDirection: DirectionType) {
    return films.sort((a, b) => {
        if (a[sortField] < b[sortField]) {
            return sortDirection === "ASC" ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
            return sortDirection === "ASC" ? 1 : -1;
        }
        return 0;
    });
}




export async function getFilms(params: FilmSearchRequest) {
    // let unifiedCursor: CursorType = {}
    let transformedFilms: any[] = await getFilmsBySearch(params)

    const sortedFilms = sortFilms(transformedFilms, params.sortField, params.sortDirection)

    return { films: sortedFilms }

}