import { Article } from "./model";
import cheerio from "cheerio";
import axios from 'axios';

export const getData = async ( html: string, url: string ): Promise<Article[]> => {
  const $ = cheerio.load(html);
  const headlines = $( '.block .headline a', html )
  const articles = $( '.list__item--text a', html );
  const requests: Promise<any>[] = [];
  const allArticles: Article[] = [];

  const addToRequests = ( element: CheerioElement ) =>{
    const href: string = $(element)[0].attribs.href;
    const request: Promise<any> = axios.get(url.concat(href));
    requests.push(request);
  }

  headlines.each( (index, element) => {
    if ( !$( element ).hasClass( 'block-title' )) addToRequests( element );
  })

  articles.each((index, element) => {
    const label = $(element).find('.item-title__label')           // Is it labeled an ad or video
    if (label.length === 0) addToRequests( element );
  })

  await axios.all( requests ).then( responses => {
    responses.forEach( res => {
      const article: Article = htmlToArticle( res.data );
      allArticles.push( article );
    })
  })
  return allArticles;
}

const htmlToArticle = (html: string ): Article => {
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
