import { CursorType, Film, FilmSearchRequest, FilmServiceUrls } from '../model';
import { AccessorClass } from '../accessors/accessor';
import { getFilms, sortFilms } from '../controller';

const vhsFilms = ["deer hunter", "gladiator", "good will hunting", "revenge of the nerds"]
const dvdFilms = ["alien", "airplane", "deer hunter", "gladiator", "revenge of the nerds"]
const prjktr = ["gladiator", "revenge of the nerds"]

let mockVhsData: Film[] = vhsFilms.map((title, index) => ({
    title,
    releaseYear: 1980,
    numberOfCopiesAvailable: 20,
    director: `Director ${index}`,
    distributor: `Distributor ${index}`,
}));

let mockDvdData: Film[] = dvdFilms.map((title, index) => ({
    title,
    releaseYear: 1980,
    numberOfCopiesAvailable: Math.floor(Math.random() * 10) + 1,
    director: `Director ${index}`,
    distributor: `Distributor ${index}`,
}));

let mockProjectorData: Film[] = prjktr.map((title, index) => ({
    title,
    releaseYear: 1980,
    numberOfCopiesAvailable: Math.floor(Math.random() * 10) + 1,
    director: `Director ${index}`,
    distributor: `Distributor ${index}`,
}));

jest.mock('../accessors/accessor', () => ({
    AccessorClass: jest.fn().mockImplementation((url) => ({
        getFilmsByParams: jest.fn((sortField, sortDirection, pageSize, cursor) => {
            if (url === FilmServiceUrls.VHS) {
                const start = cursor || 0;
                const end = start + pageSize;
                return Promise.resolve(sortFilms(mockVhsData, sortField, sortDirection).slice(start, end));
            }
            if (url === FilmServiceUrls.DVD) {
                const start = cursor || 0;
                const end = start + pageSize;
                return Promise.resolve(sortFilms(mockDvdData, sortField, sortDirection).slice(start, end));
            }
            if (url === FilmServiceUrls.PROJECTOR) {
                const start = cursor || 0;
                const end = start + pageSize;
                return Promise.resolve(sortFilms(mockProjectorData, sortField, sortDirection).slice(start, end));
            }
        }),
    })),
}));

describe('redo from test data', () => {
    it('should work with test data from lanter', async () => {
        const pageSize = 2

        const page1 = await getFilms(
            {
                currentPage: 0,
                pageSize: pageSize,
                sortField: 'title',
                sortDirection: 'ASC',
                excludeVHS: false,
                excludeDVD: false,
                excludeProjector: false,
                search: {},
                cursor: {}
            } as FilmSearchRequest
        )

        const page1Cursor: CursorType = {
            dvd: 1,
            vhs: 0,
            projector: 0
        }

        expect(page1.films.map(film => film.title)).toEqual(["airplane", "alien"])
        expect(page1.films.length).toBe(pageSize)
        expect(page1.cursor).toEqual(page1Cursor)

        const page2 = await getFilms(
            {
                currentPage: 1,
                pageSize: pageSize,
                sortField: 'title',
                sortDirection: 'ASC',
                excludeVHS: false,
                excludeDVD: false,
                excludeProjector: false,
                search: {},
                cursor: page1Cursor
            } as FilmSearchRequest
        )
        const page2Cursor: CursorType = {
            dvd: 3,
            projector: 0,
            vhs: 1
        }

        expect(page2.films.map(({ title }) => title)).toEqual(["deer hunter", "gladiator"])
        expect(page2.films.length).toBe(pageSize)
        expect(page2.cursor).toEqual(page2Cursor)

        const page3 = await getFilms(
            {
                currentPage: 2,
                pageSize: pageSize,
                sortField: 'title',
                sortDirection: 'ASC',
                excludeVHS: false,
                excludeDVD: false,
                excludeProjector: false,
                search: {},
                cursor: page2Cursor
            } as FilmSearchRequest
        )

        expect(page3.films.map(({ title }) => title)).toEqual(["good will hunting", "revenge of the nerds"])
        expect(page3.films.length).toBe(pageSize)
        expect(page3.cursor).toEqual({
            dvd: 4,
            projector: 1,
            vhs: 3
        })

    })
})