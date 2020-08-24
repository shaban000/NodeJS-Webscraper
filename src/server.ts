import express, { Application, Request, Response } from "express";
import { NuRouter } from "./routes/NuRouter";

const app: Application = express();

// TODO Route handler for API documentation
app.get( "/api/", ( req: Request, res: Response ) => {
  res.status(200).send( "Ewa harde werker" );
} );

app.use( '/api/nu', NuRouter );
export const App: Application = app;
