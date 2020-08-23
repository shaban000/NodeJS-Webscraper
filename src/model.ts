export class Article {
  private title: string;
  private description: string;
  private story: string[];
  private url: string;

  constructor( title: string, description: string, url: string ) {
      this.title = title;
      this.description = description;
      this.url = url;
      this.story = [];
  }

  public addParagraph(paragraph: string ): void{
      this.story.push( paragraph )
  }
}
