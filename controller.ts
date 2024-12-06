import { AccessorClass } from "./accessors/accessor"
import { FilmSearchRequest, FilmServiceUrls, Film, CursorType, FilmType, SortFieldType, DirectionType } from "./model"

const dvdAccessor = new AccessorClass(FilmServiceUrls.DVD)
const vhsAccessor = new AccessorClass(FilmServiceUrls.VHS)
const projectorAccessor = new AccessorClass(FilmServiceUrls.PROJECTOR)

function enhanceFilmsWithTypeAndIndex(films: Film[], type: FilmType, cursor?: number) {
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

function getStartingPoint(cursor: number | undefined) {
    return cursor === undefined ? 0 : cursor + 1
}

async function getFilmsBySearch(params: FilmSearchRequest) {
    let films: Film[] = []
    const sortField = params.sortField
    const sortDirection = params.sortDirection
    const pageSize = params.pageSize
    const cursor: CursorType = params?.cursor || {}
    const excludeDVD = params.excludeDVD
    const excludeProjector = params.excludeProjector
    const excludeVHS = params.excludeVHS

    if (!excludeDVD) {
        const start = getStartingPoint(cursor.dvd)
        const filmData: Film[] = await dvdAccessor.getFilmsByParams(sortField, sortDirection, pageSize, start)
        const transformedFilms = enhanceFilmsWithTypeAndIndex(filmData, FilmType.DVD, start)
        films = films.concat(transformedFilms as any)
    }

    if (!excludeProjector) {
        const start = getStartingPoint(cursor.projector)
        const filmData = await projectorAccessor.getFilmsByParams(sortField, sortDirection, pageSize, start)
        const transformedFilms = enhanceFilmsWithTypeAndIndex(filmData, FilmType.PROJECTOR, start)
        films = films.concat(transformedFilms as any)
    }

    if (!excludeVHS) {
        const start = getStartingPoint(cursor.vhs)
        const filmData = await vhsAccessor.getFilmsByParams(sortField, sortDirection, pageSize, start)
        const transformedFilms = enhanceFilmsWithTypeAndIndex(filmData, FilmType.VHS, start)
        films = films.concat(transformedFilms as any)
    }
    return films
}

export function sortFilms(films: any[], sortField: SortFieldType, sortDirection: DirectionType) {
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

function dedup(films: any[], pageSize: number, cursor: CursorType) {
    const seen = new Set<string>();
    const dedupedFilms: any[] = [];
    let filmsProcessed = 0;
    let found = false;

    for (const film of films) {
        const filmKey = `${film.title}-${film.releaseYear}`;

        if (!seen.has(filmKey)) {
            if (found) {
                break
            }

            seen.add(filmKey);

            const uniqueFilm: Film = {
                title: film.title,
                releaseYear: film.releaseYear,
                numberOfCopiesAvailable: film.numberOfCopiesAvailable,
                director: film.director,
                distributor: film.distributor
            }

            dedupedFilms.push(uniqueFilm);

            filmsProcessed++;

            if (dedupedFilms.length === pageSize) {
                found = true
            }
        }

        if (film.type === FilmType.DVD) cursor.dvd = film.index;
        if (film.type === FilmType.VHS) cursor.vhs = film.index;
        if (film.type === FilmType.PROJECTOR) cursor.projector = film.index;
    }

    return {
        films: dedupedFilms,
        cursor
    }
}

export async function getFilms(params: FilmSearchRequest) {
    let transformedFilms: any[] = await getFilmsBySearch(params)
    const sortedFilms = sortFilms(transformedFilms, params.sortField, params.sortDirection)
    const newCursor: CursorType = {
        dvd: params.cursor?.dvd || 0,
        vhs: params.cursor?.vhs || 0,
        projector: params.cursor?.projector || 0
    }

    return dedup(sortedFilms, params.pageSize, newCursor)
}