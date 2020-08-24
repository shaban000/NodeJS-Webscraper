import { App } from "./server";

const port: string = process.env.PORT || '5000'; // default port to listen

// start the Express server
App.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at http://localhost:${ port }/api` );
} );
