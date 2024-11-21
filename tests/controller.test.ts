import { Film, FilmSearchRequest, FilmServiceUrls } from '../model';
import { AccessorClass } from '../accessors/accessor';
import { getFilms, sortFilms } from '../controller';

let mockVhsData: Film[] = Array.from({ length: 50 }, (_, index) => ({
    title: `Film Title ${index + 1}`,
    releaseYear: 1980,
    numberOfCopiesAvailable: 20,
    director: `Director ${index}`,
    distributor: `Distributor ${index}`,
}));

let mockDvdData: Film[] = Array.from({ length: 50 }, (_, index) => ({
    title: `Film Title ${index * 2}`,
    releaseYear: 1980,
    numberOfCopiesAvailable: Math.floor(Math.random() * 10) + 1,
    director: `Director ${index}`,
    distributor: `Distributor ${index}`,
}));

let mockProjectorData: Film[] = Array.from({ length: 50 }, (_, index) => ({
    title: `Film Title ${index * 3}`,
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

describe('controller', () => {
    describe("getFilms", () => {
        it('should ', async () => {
            const mockVHS = new AccessorClass(FilmServiceUrls.VHS);
            const mockDVD = new AccessorClass(FilmServiceUrls.DVD);
            const mockProjector = new AccessorClass(FilmServiceUrls.PROJECTOR);

            const pageSize = 10

            const page1 = await getFilms(
                {
                    currentPage: 1,
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

            const newCursor = {
                dvd: 1,
                vhs: 2,
                projector: 5

            }

            expect(page1.films.length).toBe(pageSize)
            expect(page1.cursor).toEqual(newCursor)

            const page2 = await getFilms(
                {
                    currentPage: 2,
                    pageSize: pageSize,
                    sortField: 'title',
                    sortDirection: 'ASC',
                    excludeVHS: false,
                    excludeDVD: false,
                    excludeProjector: false,
                    search: {},
                    cursor: newCursor
                } as FilmSearchRequest
            )

            expect(page2.films.length).toBe(pageSize)
            expect(page2.cursor).toEqual({
                dvd: 2,
                projector: 11,
                vhs: 3
            })

        })
    })
})
