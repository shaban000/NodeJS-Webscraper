import express, { Application } from "express";
import axios from 'axios'
import { Article } from "./model";
import { WebscrapeController } from "./controller";

const app: Application = express();
const port: string = '5000' || process.env.PORT; // default port to listen
const baseUrl = 'https://www.nu.nl';
const controller = new WebscrapeController();

const getArticlesFromUrl = ( res: any, url: string ) => {
  axios.get( url )
    .then( async MainPageResponse => {

      const hrefs: string[] = controller.getAllArticleHrefs( MainPageResponse.data );
      if ( hrefs.length ===  0 ) res.status(500).send( 'This page does not contain any articles.' )

      const requests: Promise<any>[] = [];
      hrefs.forEach( href => {
        const request: Promise<any> = axios.get( url.concat( href ));
        requests.push(request);
      })

      const allArticles: Article[] = [];
      await axios.all( requests )
        .then( responses => {
          responses.forEach( articleResponse => {
            if (res.status === 200){
              const article: Article = controller.getArticleData( articleResponse.data, articleResponse.config.url );
              allArticles.push( article );
            }
            if ( allArticles.length > 0 ) res.status(200).send( allArticles );
            else res.status(500).send( 'None of article could be scraped for data XD' );
          } )
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
