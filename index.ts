// src/index.ts
import express, { Express, Request, Response } from "express";
import { Film, FilmSearchRequest } from "./model";
import { getFilms } from "./controller";


const port = 4000;
const app: Express = express();

app.use(express.json());

app.post("/search", async (req: Request, res: Response) => {
    const searchParms: FilmSearchRequest = req.body
    const films: Film[] = await getFilms(searchParms)
    res.send(films);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});