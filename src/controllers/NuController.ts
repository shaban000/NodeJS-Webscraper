import { Article } from "../models/Article";
import cheerio from "cheerio";

export class NuController {

  private _headlinesSelector: string = '.block.headline a';
  private _articlesSelector: string = '.list__item--thumb a';
  private _titleSelector: string = 'h1';
  private _descriptionSelector: string = '.first .block-content .excerpt';
  private _paragraphSelector: string = '.first .block-content p';

  public getAllArticleHrefs ( html: string ): string[] {
    const $ = cheerio.load( html );
    const headlines  = $( this._headlinesSelector, html );
    const articles = $( this._articlesSelector, html );
    const hrefs: string[] = [];

    const addhref = ( element: CheerioElement ) =>{
      const href: string = $(element)[0].attribs.href;
      hrefs.push( href )
    }

    headlines.each( (index, element) => {
      const excludeClass: string = 'block-title';
      if ( !$( element ).hasClass( excludeClass )) addhref( element );
    })

    articles.each((index, element) => {
      const labelClass: string = '.item-title__label';
      const label = $( element ).find( labelClass );      // Find the labels for this article.
      if (label.length === 0) addhref( element );         // Only Ads and video's articles have labels.
    })

    return hrefs;
  }

  public getArticleData ( html: string, url: string ): Article {
    const $ = cheerio.load( html );
    const title: string = $( this._titleSelector, html ).text();
    const description: string = $( this._descriptionSelector, html ).text()
    const article: Article = new Article( title, description, url );
    const paragraphs = $( this._paragraphSelector, html );

    paragraphs.each((index, element) => {
      const excludeClass: string = 'excerpt';
      if ( !$( element ).hasClass( excludeClass )) {
        const paragraph: string = $( element ).text();
        article.addParagraph( paragraph )
      }
    })

    return article;
  }
}
