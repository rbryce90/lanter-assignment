import { Film, FilmSearchRequest, FilmServiceUrls } from '../model';
import { getFilms } from '../controller';
import { AccessorClass } from '../accessors/accessor';


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
        getFilmsByParams: jest.fn(() => {
            if (url === FilmServiceUrls.VHS) return Promise.resolve(mockVhsData.slice(0, 19));
            if (url === FilmServiceUrls.DVD) return Promise.resolve(mockDvdData.slice(0, 19));
            if (url === FilmServiceUrls.PROJECTOR) return Promise.resolve(mockProjectorData.slice(0, 19));
        }),
    })),
}));

describe('controller', () => {
    describe("getFilms", () => {
        it('should ', async () => {
            // console.log('mock VHS ===> ', mockVhsData.slice(0, 5))
            // console.log('mock DVD ===> ', mockDvdData.slice(0, 5))
            // console.log('mock Projector ===> ', mockProjectorData.slice(0, 5))
            const mockVHS = new AccessorClass(FilmServiceUrls.VHS);
            const mockDVD = new AccessorClass(FilmServiceUrls.DVD);
            const mockProjector = new AccessorClass(FilmServiceUrls.PROJECTOR);
            const pageSize = 10


            const res = await getFilms(
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

            expect(res.films.length).toBe(pageSize)

            expect(res).toEqual({ films: [], cursor: {} })

        })
    })
})
