import express, { Application } from "express";
import { serve, setup } from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import * as swaggerDocument from '../build/swagger.json';

const app = express();

RegisterRoutes( app );

/**
 * This endpoint is for the Swagger API documentation.
 */
app.use('/api', serve, setup( swaggerDocument ));

export const App: Application = app;
