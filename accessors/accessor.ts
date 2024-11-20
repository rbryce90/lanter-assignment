import axios from 'axios'
import { Film } from '../model'

export class AccessorClass {
    url: string
    constructor(url: string) {
        this.url = url
    }

    async getFilmsByParams(sortField: "title" | "releaseYear", sortDirection: "ASC" | "DESC", pageSize: number, cursor?: number): Promise<Film[]> {
        const url = `http://${this.url}/search`

        return await axios.post(url, {
            sortDirection,
            sortField,
            cursor
        })
    }
}
