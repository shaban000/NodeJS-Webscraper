import { Article } from "./model";
import cheerio from "cheerio";
import axios from 'axios';

export const getData = async ( html: string, url: string ): Promise<Article[]> => {
  const $ = cheerio.load(html);
  const headlines = $( '.block.headline a', html )
  const articles = $( '.list__item--thumb a', html );
  const requests: Promise<any>[] = [];
  const allArticles: Article[] = [];

  const addRequests = ( element: CheerioElement ) =>{
    const href: string = $(element)[0].attribs.href;
    const request: Promise<any> = axios.get( url.concat( href ));
    requests.push(request);
  }

  headlines.each( (index, element) => {
    if ( !$( element ).hasClass( 'block-title' )) addRequests( element );
  })

  articles.each((index, element) => {
  const label = $( element ).find('.item-title__label' );      // Find the labels for this article.
    if (label.length === 0) addRequests( element );                     // Only Ads and video's articles have labels.
  })

  await axios.all( requests ).then( responses => {
    responses.forEach( res => {
      if (res.status === 200){
        const article: Article = htmlToArticle( res.data, res.config.url );
        allArticles.push( article );

        // tslint:disable-next-line:no-console
      } else console.log(res);
    })
  })
  return allArticles;
}

const htmlToArticle = (html: string, url: string): Article => {
  const $ = cheerio.load( html );
  let title: string = $( 'h1', html ).text();
  let description: string = $( '.first .block-content .excerpt', html ).text()

  const cleanUpText = ( text: string ): string =>{
    return text;
  }

  title = cleanUpText( title );
  description = cleanUpText( description );
  const article: Article = new Article( title, description, url );
  const paragraphs = $( '.first .block-content p', html );
  paragraphs.each((index, element) => {
    if ( !$( element ).hasClass( 'excerpt' )) {
      let paragraph: string = $( element ).text();
      paragraph = cleanUpText( paragraph );
      article.addParagraph( paragraph )
    }
  })
  return article;
}
