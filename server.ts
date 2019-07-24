import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
import 'zone.js/dist/zone-node';
// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
  ngExpressEngine,
  provideModuleMap
} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
  })
);

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// the demo cdn server
app.get('/cdn/:imageName?/:width?', async (req, res) => {
  if (!req.params.imageName) {
    res.status(404).end('Not found');
  } else {
    const width = +req.params.width;
    let imageName = req.params.imageName;

    switch (true) {
      case !width:
        imageName += '-md.jpg';
        break;
      case width < 600:
        imageName += '-xs.jpg';
        break;
      case width >= 600 && width < 960:
        imageName += '-sm.jpg';
        break;
      case width >= 960 && width < 1280:
        imageName += '-md.jpg';
        break;
      case width >= 1280 && width < 1920:
        imageName += '-lg.jpg';
        break;
      case width >= 1920:
        imageName += '-xl.jpg';
        break;
      default:
        imageName += '-md.jpg';
        break;
    }

    const fileStream = fs.createReadStream(
      path.join(__dirname, 'images', imageName)
    );

    fileStream.on('error', () => {
      res.status(404).end('Not found');
    });

    res.set('Content-Type', 'image/jpeg');
    fileStream.pipe(res);
  }
});

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y'
  })
);

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
