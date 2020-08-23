import express, { Application } from "express";
import axios from 'axios'
import * as Controller from "./controller";

const app: Application = express();
const port: string = '5000' || process.env.PORT; // default port to listen
const baseUrl = 'https://www.nu.nl';

const getArticlesFromUrl = ( res: any, url: string ) => {
  axios.get( url )
    .then( async webRes => {
      await Controller.getData( webRes.data, baseUrl )
        .then( articles => {
          res.status(200).send( articles );
        } ).catch(() => {
          res.status(404).send( `Articles could not be gathered` );
        } )
    } ).catch( err => {
      res.status( err.response.status ).send( `Could not retrieve a response from ${ url }, This might be an invalid url or the server is currently unreachable.` );
    } )
}

// TODO Route handler for API documentation
app.get( "/api/", ( req, res ) => {
  res.status(200).send( "Ewa harde werker" );
} );

// Route handler getting articles from the main webpage.
app.get( "/api/main", ( req, res ) => {
  getArticlesFromUrl( res , baseUrl );
} );

// Route handler getting articles from an sub directory webpage.
app.get( "/api/sub/:dir", ( req, res ) => {
  const directory: string = req.params.dir;
  const url = baseUrl.concat('/').concat( directory )
  getArticlesFromUrl( res, url );
} );

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }/api` );
} );
