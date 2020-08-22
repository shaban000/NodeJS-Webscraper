import express, { Application }from "express";
import axios from 'axios'
import * as Controller from "./controller";

const app: Application = express();
const port: string = '5000' || process.env.PORT; // default port to listen
const url = 'https://www.nu.nl/';

// define a route handler for the default home page
app.get( "/api/", ( req, res ) => {
    res.status(200).send( "Ewa harde werker" );
} );

// define a route handler for the default home page
app.get( "/api/scrape", ( req, res ) => {
    axios.get( url )
        .then(async webRes => {
           await Controller.getData( webRes.data, url )
             .then( data => {
               res.status(200).send( data );
           })
             .catch( err => {
               res.status(400).send( 'Welloe' );
             })
        } ).catch( err => {
            res.status(500).send( `Error message: ${ err.message }` );
    } )
} );

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }/api` );
} );
