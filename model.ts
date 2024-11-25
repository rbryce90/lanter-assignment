export type CursorType = { vhs?: number, dvd?: number, projector?: number }

export enum FilmType {
    VHS = "vhs",
    DVD = "dvd",
    PROJECTOR = "projector"
}

export type DirectionType = "ASC" | "DESC"

export type SortFieldType = "title" | "releaseYear"




export type FilmSearchRequest = {
    currentPage: number;
    pageSize: number;
    sortField: SortFieldType;
    sortDirection: DirectionType
    excludeVHS: boolean;
    excludeDVD: boolean;
    excludeProjector: boolean;
    search?: {
        title: string;
        releaseYear: number;
        director: string;
        distributor: string;
    }
    cursor?: CursorType
}

export type Film = {
    title: string;
    releaseYear: number;
    numberOfCopiesAvailable: number;
    director: string;
    distributor: string;
}

export enum FilmServiceUrls {
    DVD = "dvd.service.com",
    VHS = "vhs.service.com",
    PROJECTOR = "prjktr.service.com"
}
