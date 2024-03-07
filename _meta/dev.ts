///////////////////
///// IMPORTS /////
///////////////////

// based on
// https://github.com/wayfolk/everything/tree/main/wayf0000/_development/_web/_codebase/_projects/theu0000/_src
// https://github.com/wayfolk/everything/blob/main/common/_development/_web/_builder/Builder.mjs

// NODE
import fs from "node:fs";
import path from "node:path";

// NPM
import * as chokidar from "chokidar";
import * as htmlminifier from "html-minifier";

// global to access it from the watcher script
let _bunServer;
let buildId;

class Builder
{
  constructor()
  {
    this.build(); // once
    this.watch(); // now watch
  }

  build()
  {
    buildId = crypto.randomUUID();

    this.clean();
    this.copy();
    this.buildHTML("./_build/index.html");
    this.buildHTML("./_build/about/index.html");
    this.buildJS();
  }

  clean()
  {
    fs.rmSync("./_build",
      {
        recursive: true,
        force: true,
      }
    );

    fs.mkdirSync("./_build");
  };

  copy()
  {
    fs.cpSync("./_src/index.html", "./_build/index.html");
    fs.cpSync("./_src/about/index.html", "./_build/about/index.html");
  };

  buildHTML(filePath: string)
  {
    const sIndexTemplate = fs.readFileSync(filePath,
      {
        encoding: "utf8",
        flag: "r",
      }
    );

    const sMinifiedIndexTemplate = htmlminifier.minify(sIndexTemplate,
      {
        removeComments: true,
        collapseWhitespace: true,
        useShortDoctype: false,
        minifyCSS: true,
      }
    );

    fs.writeFileSync(filePath, sMinifiedIndexTemplate,
      {
        encoding: "utf8",
        flag: "w"
      }
    );
  };

  async buildJS()
  {
    console.log("Builder : build started");

    const { success, logs } = await Bun.build(
      {
        entrypoints: ["./_src/main.ts"],
        // external: ["gsap", "three"],
        // plugins: [],
        outdir: "./_build",
        naming: {
          entry: "[dir]/[name].[ext]",
          // entry: "[dir]/[name]_" + buildId + ".[ext]",
          asset: "[dir]/[name].[ext]"//,
          // chunk: "[dir]/[name].[ext]"
        },
        format: "esm",
        target: "browser",
        splitting: false,
        sourcemap: "external", //seems broken atm https://github.com/oven-sh/bun/issues/7427
        minify:
        {
          whitespace: true,
          identifiers: true,
          syntax: true,
        },
        define:
        {
          DEBUG_PORT: "\"" + 8000 + "\"",
          BUILD_ID: "\"" + buildId + "\""
        },
        loader:
        {
          ".html" : "text", ".css": "text"
        },
      }
    );

    console.log(success ? 'build succeeded' : 'build failed: ' + logs.join('\n'));
    if (logs.length > 0) console.log(logs);

    console.log("Builder : build done");
  };

  postBuild()
  {

  };

  watch()
  {
    const watcher = chokidar.watch("./_src",
      {
        ignoreInitial: true,
        usePolling: false,
      }
    );

    console.log("_builder: watcher: watching");

    watcher.on('all', function()
      {
        this.build();
        _bunServer.publish("the-group-chat", "boom! new build ready.")

      }.bind(this)
    );
  };
};

class HttpServer
{
  _publicPath: string;

  constructor(nPort = "3000")
  {
    this.start(nPort);
    console.log("HttpServer : running");
  };

  start(nPort: string)
  {
    this._publicPath = "./_build/";

    _bunServer = Bun.serve(
      {
        development: false,
        port: nPort,
        fetch: function(request: Request, server)
        {
          if (server.upgrade(request)) return; // ws upgrade, do not return a response

          const url = new URL(request.url);
          const publicFilePath = this._publicPath + url.pathname;
          const ext = path.extname(publicFilePath);
          const status = 200;

          if (url.pathname === "/")
          {
            return new Response(Bun.file(this._publicPath + "index.html"), { status: status, headers: { "Content-Type": "text/html; charset=utf-8" } });
          }
          else if (url.pathname === "/about")
          {
            return new Response(Bun.file(this._publicPath + "/about/index.html"), { status: status, headers: { "Content-Type": "text/html; charset=utf-8" } });
          }
          else if(ext === ".js")
          {
            return new Response(Bun.file(publicFilePath), { status: status, headers: { "Content-Type": "text/javascript" } });
          }
          else if(ext === ".map")
          {
            return new Response(Bun.file(publicFilePath), { status: status, headers: { "Content-Type": "text/javascript" } });
          }
          else if(ext === ".jpg")
          {
            return new Response(Bun.file(publicFilePath), { status: status, headers: { "Content-Type": "image/jpeg" } });
          }

        }.bind(this),
        websocket:
        {
          // handler called when a message is received
          message: function(ws, message)
          {
            console.log(`Received: ${message}`);
            ws.subscribe("the-group-chat");
            _bunServer.publish("the-group-chat", "ping");
            // ws.send("ola")
            // const user = getUserFromToken(ws.data.authToken);
            // await db.Message.insert({
              // message: String(message),
              // userId: user.id,
            // });
          }.bind(this),
        },
        // Bun prefers a global error handler here, as fs checks for a file to exist will slow things down.
        // TODO: can we properly check for 404s? If not, we just return 500s.
        error(error)
        {
          console.log(error);
          return new Response(null, { status: 500 });
        },
      }
    );
  };
};

const _builder = new Builder();
const _httpServer = new HttpServer("8000");

console.log("running");