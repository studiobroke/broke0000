///////////////////
///// IMPORTS /////
///////////////////

// based on
// https://github.com/wayfolk/everything/tree/main/wayf0000/_development/_web/_codebase/_projects/theu0000/_src
// https://github.com/wayfolk/everything/blob/main/common/_development/_web/_builder/Builder.mjs

// BUN
import fs from "node:fs";
import path from "node:path";

// NPM
import * as chokidar from "chokidar";
import * as htmlminifier from "html-minifier";

// global to access it from the watcher script
let _bunServer;

class Builder
{
  buildId;

  constructor(bWatching = false)
  {
    this.build();
    if (bWatching) this.watch();
  }

  build()
  {
    this.buildId = crypto.randomUUID();

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
    // TODO?: abstract into a "page builder" step
    fs.cpSync("./_src/pages/_templates/index.html", "./_build/index.html");
    fs.cpSync("./_src/pages/_templates/index.html", "./_build/about/index.html");

    // TODO: incorporate buildid in the file naming
    // move assets
    // ref: https://github.com/pmndrs/detect-gpu/tree/master/benchmarks (2024.02.01)
    fs.cpSync("./_src/_assets/_benchmarks/", "./_build/_assets/_benchmarks/", { recursive: true });
  };

  buildHTML(filePath: string)
  {
    let sIndexTemplate = fs.readFileSync(filePath,
      {
        encoding: "utf8",
        flag: "r",
      }
    );

    // rewrite paths based on buildId
    let oRegExp = new RegExp("<insert main component>", "g");
    sIndexTemplate = sIndexTemplate.replace(oRegExp, "Main_" + this.buildId +".js");
    
   
    // TODO : refactor
    oRegExp = new RegExp("<insert page component>", "g");
    if (filePath === "./_build/index.html")
    {
      sIndexTemplate = sIndexTemplate.replace(oRegExp, "/pages/home/Home_" + this.buildId +".js");
    }
    else if (filePath === "./_build/about/index.html")
    {
      sIndexTemplate = sIndexTemplate.replace(oRegExp, "/pages/about/About_" + this.buildId +".js");
    };

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
    console.log("Builder : build started : id = " + this.buildId);

    const { success, logs } = await Bun.build(
      {
        entrypoints: ["./_src/Main.ts", "./_src/pages/home/Home.ts", "./_src/pages/about/About.ts"],
        // external: ["gsap", "three"],
        // plugins: [],
        outdir: "./_build",
        naming:
        {
          entry: "[dir]/[name]_" + this.buildId + ".[ext]",
          asset: "[dir]/[name].[ext]"
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
          BUILD_ID: "\"" + this.buildId + "\""
        },
        loader:
        {
          ".html" : "text", ".css": "text"
        },
      }
    );

    console.log(success ? "Builder : build done" : "build failed: " + logs.join('\n'));
    if (logs.length > 0) console.log(logs);
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

          if (url.pathname === "/") return new Response(Bun.file(this._publicPath + "index.html"), { status: status, headers: { "Content-Type": "text/html; charset=utf-8" } });
          else if (url.pathname === "/about") return new Response(Bun.file(this._publicPath + "/about/index.html"), { status: status, headers: { "Content-Type": "text/html; charset=utf-8" } });
          else if(ext === ".js") return new Response(Bun.file(publicFilePath), { status: status, headers: { "Content-Type": "text/javascript" } });
          else if(ext === ".map") return new Response(Bun.file(publicFilePath), { status: status, headers: { "Content-Type": "text/javascript" } });
          else if(ext === ".json") return new Response(Bun.file(publicFilePath), { status: status, headers: { "Content-Type": "application/json" } });
          else if(ext === ".jpg") return new Response(Bun.file(publicFilePath), { status: status, headers: { "Content-Type": "image/jpeg" } });

        }.bind(this),
        websocket:
        {
          // handler called when a message is received
          message: function(ws, message)
          {
            // console.log(`Received: ${message}`);

            ws.subscribe("the-group-chat");
            _bunServer.publish("the-group-chat", "ping");

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

///////////////////////
///// INSTANTIATE /////
///////////////////////

if (Bun.argv[2] === '--dev')
{
  const _builder = new Builder(true);
  const _httpServer = new HttpServer("8000");
}
else if (Bun.argv[2] === '--build')
{
  const _builder = new Builder(false);
};