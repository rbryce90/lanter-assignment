// src/index.ts
import express, { Express, Request, Response } from "express";
import { Film, FilmSearchRequest, CursorType } from "./model";
import { getFilms } from "./controller";


const port = 4000;
const app: Express = express();

app.use(express.json());

app.post("/search", async (req: Request, res: Response) => {
    const searchParms: FilmSearchRequest = req.body
    const payload: { films: Film[], cursor: CursorType } = await getFilms(searchParms)
    res.send(payload);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});