import {Controller, Get, Route, SuccessResponse, Response, Res, Path, TsoaResponse, Post} from "tsoa";
import { Article } from "../models/Article";
import { NuService } from "../services/NuService";
import axios from 'axios';

@Route( 'api/nu/' )
export class NuRouter extends Controller {

  private baseUrl = 'https://www.nu.nl';
  private service = new NuService();

  private async getArticles(url: string,
                            error404: TsoaResponse<404, { message: string }>,
                            error500: TsoaResponse<500, { message: string }>): Promise<Article[]> {
    let allArticles: Article[] = null;
    await axios.get(url)
      .then(async MainPageResponse => {
        const hrefs: string[] = this.service.getAllArticleHrefs(MainPageResponse.data);
        if (hrefs.length > 0) {
          const requests: Promise<any>[] = [];
          hrefs.forEach(href => {
            const request: Promise<any> = axios.get(this.baseUrl.concat(href));
            requests.push(request);
          })
          await axios.all(requests)
            .then(responses => {
              allArticles = [];
              responses.forEach(articleResponse => {
                if (articleResponse.status === 200) {
                  const article: Article = this.service.getArticleData(articleResponse.data, articleResponse.config.url);
                  allArticles.push(article);
                }
              })
              if (allArticles.length > 0) return allArticles;
              else error404(404, {message: `None of article could be scraped for data XD`})
            })
            .catch((err) => {
              error404(404, {message: `Articles could not be gathered. Error Message: ${err.message}`})
            })
        } else error500(500, {message: '${ url } did not contain any articles for webscraping.'})
      })
      .catch(() => {
        error500(500, {message: `Could not retrieve a response from ${url}, This might be an invalid url or the server is currently unreachable.`})
      })
    return allArticles;
  }

  @Get()
  @SuccessResponse('200', 'Successful')
  @Response('404', 'No articles could be found')
  @Response('500', 'Not found')
  public async nuMain(@Res() error404: TsoaResponse<404, { message: string }>,
                    @Res() error500: TsoaResponse<500, { message: string }>): Promise<Article[]> {
    return await this.getArticles( this.baseUrl, error404, error500 );
  }

  @Get('{dir}')
  @SuccessResponse('200', 'Successful')
  @Response('404', 'No articles could be found')
  @Response('500', 'Not found')
  public async nuDirectory(@Path() dir: string,
                         @Res() error404: TsoaResponse<404, { message: string }>,
                         @Res() error500: TsoaResponse<500, { message: string }>): Promise<Article[]> {
    const url = this.baseUrl.concat( '/' ).concat( dir )
    return await this.getArticles( url, error404, error500 );
  }
}
