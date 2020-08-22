import express, { Application }from "express";
import cheerio from "cheerio";
import axios from 'axios'
import { Article } from './model'
// import * as Controller from "./controller";

const app: Application = express();
const port: string = '5000' || process.env.PORT; // default port to listen
const url = 'https://www.nu.nl/';

const htmlToArticle = ( html: string ): Article => {
    const $ = cheerio.load( html );
    const title: string = $( 'h1', html ).text();
    const description: string = $( '.first .block-content .excerpt p', html ).text();
    const article: Article = new Article( title, description );

    const paragraphs = $( '.first .block-content p', html );
    paragraphs.each((index, element) => {
        if ( !$( element ).hasClass( 'excerpt' )) {
            const paragraph = $( element ).text();
            article.addParagraph( paragraph )
        }
    })
    return article;
}

// define a route handler for the default home page
app.get( "/api/", ( req, res ) => {
    res.status(200).send( "Hello world!" );
} );

// define a route handler for the default home page
app.get( "/api/scrape", ( req, res ) => {
    axios.get( url )
        .then(async webRes => {
            const $ = cheerio.load( webRes.data );
            const articles = $('.list__item--text a', webRes.data);
            const requests: any[] = [];
            const data: Article[] = [];

            articles.each((index, element) => {
                const label = $(element).find('.item-title__label')           // Is it labeled an ad or video
                if (label.length === 0) {
                    const href: string = $(element)[0].attribs.href;
                    const request = axios.get(url.concat(href));
                    requests.push(request);
                }
            })

            await axios.all(requests).then(responses => {
                responses.forEach(res2 => {
                    const article: Article = htmlToArticle(res2.data);
                    data.push(article);
                })
                res.status(200).send( data );
            }).catch(() => {
                res.status(404).send( 'No articles' );
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