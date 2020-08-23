import { Article } from "./model";
import cheerio from "cheerio";

export class WebscrapeController {

  public getAllArticleHrefs ( html: string ): string[] {
    const $ = cheerio.load( html );
    const headlines  = $( '.block.headline a', html );
    const articles = $( '.list__item--thumb a', html );
    const hrefs: string[] = [];

    const addhref = ( element: CheerioElement ) =>{
      const href: string = $(element)[0].attribs.href;
      hrefs.push( href )
    }

    headlines.each( (index, element) => {
      if ( !$( element ).hasClass( 'block-title' )) addhref( element );
    })

    articles.each((index, element) => {
      const label = $( element ).find('.item-title__label' );      // Find the labels for this article.
      if (label.length === 0) addhref( element );                           // Only Ads and video's articles have labels.
    })

    return hrefs;
  }

  public getArticleData ( html: string, url: string ): Article {
    const $ = cheerio.load( html );
    const title: string = $( 'h1', html ).text();
    const description: string = $( '.first .block-content .excerpt', html ).text()
    const article: Article = new Article( title, description, url );
    const paragraphs = $( '.first .block-content p', html );

    paragraphs.each((index, element) => {
      if ( !$( element ).hasClass( 'excerpt' )) {
        const paragraph: string = $( element ).text();
        article.addParagraph( paragraph )
      }
    })

    return article;
  }
}
