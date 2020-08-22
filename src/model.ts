export class Article {
    private title: string;
    private description: string;
    private story: string[];

    constructor( title: string, description: string ) {
        this.title = title;
        this.description = description;
        this.story = [];
    }

    public addParagraph(paragraph: string ): void{
        this.story.push( paragraph )
    }
}
