export type FilmSearchRequest = {
    currentPage: number;
    pageSize: number;
    sortField: 'title' | 'releaseYear';
    sortDirection: 'ASC' | 'DESC'
    excludeVHS: boolean;
    excludeDVD: boolean;
    excludeProjector: boolean;
    search: {
        title: string;
        releaseYear: number;
        director: string;
        distributor: string;
    }
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