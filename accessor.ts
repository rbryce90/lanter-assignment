import axios from 'axios'
import { Film } from './model'

export class AccessorClass {
    url: string
    constructor(url: string) {
        this.url = url
    }

    async getFilmsByParams(sortField: "title" | "releaseYear", sortDirection: "ASC" | "DESC", pageSize: number, currentPage: number): Promise<Film[]> {
        const url = `${this.url}/search`

        return await axios.post(url, {
            sortDirection,
            sortField,
        })
    }
}
