import { WebscrapeController } from '../src/controller'
import { Article } from "../src/model";

const subject = new WebscrapeController();

test('test_testing', () => {
  expect(true ).toBe(true );
})

test( 'test_getAllArticleHrefs_oneArticleHtml', () => {
  // Arrange
  const html = '<div><li class="list__item list__item--thumb" ><a' +
    ' href="/champions-league/6072746/psg-en-bayern-missen-grote-kansen-in-eerste-helft.html"></a></li></div>'

  // Act
  const hrefs: string[] = subject.getAllArticleHrefs( html );

  // Assert
  expect( hrefs.length ).toBe( 1 );

} )

test( 'test_getArticleData', () => {
  // Arrange
  const url = '/getArticleDataTest';
  const title = 'Test for getArticleData methode.';
  const description = 'Converting HTML Article to Article Model.';
  const paragraphs = [ 'paragraph 1'];

  // Act
  const html = `<div><h1>${ title }</h1><div class="first"><div class="block-content">
    <p class="excerpt">${ description }</p><p>${ paragraphs[0] }</p></div></div></div>`;
  const article: Article = subject.getArticleData( html , url );

  // Assert
  expect( article.url ).toBe( url );
  expect( article.title ).toBe( title );
  expect( article.description ).toBe( description );
  expect( article.paragraphs[0] ).toBe( paragraphs[0] );
} )
