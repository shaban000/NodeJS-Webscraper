import { Router, Request, Response } from 'express';
import { NuController } from "../controllers/NuController";
import { Article } from "../models/Article";
import axios from "axios";

const router: Router = Router();
const baseUrl = 'https://www.nu.nl';
const controller = new NuController();

const getArticlesFromUrl = ( res: Response, url: string ) => {
  axios.get( url )
    .then( async MainPageResponse => {
      const hrefs: string[] = controller.getAllArticleHrefs( MainPageResponse.data );
      if (hrefs.length === 0) return res.status( 500 ).send( 'This page does not contain any articles.' )
      const requests: Promise<any>[] = [];
      hrefs.forEach( href => {
        const request: Promise<any> = axios.get( baseUrl.concat( href ));
        requests.push(request);
      })

      await axios.all( requests )
        .then( responses => {
          const allArticles: Article[] = [];
          responses.forEach( articleResponse => {
            if (articleResponse.status === 200){
              const article: Article = controller.getArticleData( articleResponse.data, articleResponse.config.url );
              allArticles.push( article );
            }
          })
          if ( allArticles.length > 0 ) res.status(200).send( allArticles );
          else res.status(500).send( `None of article could be scraped for data XD, ${ allArticles }`  );
        })
        .catch((err) => {
          res.status(404).send( `Articles could not be gathered. Error Message: ${ err.message }` );
        })
    })
    .catch(() => {
      res.status( 500 ).send( `Could not retrieve a response from ${ url }, This might be an invalid url or the server is currently unreachable.` );
    })
}

router.get('/', (req: Request, res: Response ) => {
  getArticlesFromUrl( res , baseUrl );
});

router.get('/:dir', ( req: Request, res: Response ) => {
  const directory: string = req.params.dir;
  const url = baseUrl.concat( '/' ).concat( directory )
  getArticlesFromUrl( res, url );
});

export const NuRouter: Router = router;
