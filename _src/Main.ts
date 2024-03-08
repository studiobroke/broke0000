///////////////////
///// IMPORTS /////
///////////////////

// NPM
import { series } from "async";
import { gsap } from "gsap";

// LOCAL
import { ENV } from "./_utils/ENV";

// CSS ASSETS
// import font_0001_r from "./_assets/_fonts/font_0001_r.woff2";

/////////////////
///// CLASS /////
/////////////////

class Main extends HTMLElement
{
  domShadowRoot = Object.create(null);

  constructor()
  {
    super();
    console.log("_main: constructor()");

    const socket = new WebSocket("ws://localhost:" + DEBUG_PORT);

    // Connection opened
    socket.addEventListener("open", (event) => {
      socket.send("pong");
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);

      if (event.data === "boom! new build ready.") window.location.reload();
    });


    this.__init();
  };

  ///////////////////////////
  ///// CLASS LIFECYCLE /////
  ///////////////////////////

  __init()
  {
    series(
      [
        function(fCB) { ENV.detectGPU(fCB); }.bind(this),
        function(fCB) { this.loadFonts(fCB); }.bind(this),
      ],
      function (err, results)
      {
        console.log("TODO: we need to wait for this:");
        console.log("_main: __init: done");
        console.log(ENV.getGPU());
        
        // TODO?: refac this?
        // Handle the color of the body here instead of CSS, so we don't get a flash on first paint.
        // The delay prevents an ugly blend with the component .intro() animations.
        gsap.fromTo
        (
          document.body,
          { backgroundColor: "rgb(0, 0, 0)"}, // start from here to avoid an ungly transition using just gsap.to
          { backgroundColor: "rgb(253, 245, 229)", duration: .900, delay: 0.0, ease: "none" },
        );

      }.bind(this)
    );
  };

  ///////////////////////////////
  ///// __INIT CONTROL FLOW /////
  ///////////////////////////////

  loadFonts(fCB)
  {
    const load = function(sFontFace, sFontFacePath, fCB2)
    {
      const fontFace = new FontFace(sFontFace, "url(" + sFontFacePath + ")");
      fontFace.load()
      .then
      (function(loadedFont)
        {
          // TS is wrong about the add method not existing
          // ref: https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/add
          // @ts-ignore
          document.fonts.add(loadedFont);

          fCB2()
        }
      );
    };

    series(
      [
        // TODO: check if we use all these
        // function(fCB2) { load("font_0001_r", font_0001_r, fCB2); }.bind(this),
        // function(fCB2) { load("font_0002_r", font_0002_r, fCB2); }.bind(this),
        // function(fCB2) { load("font_0002_l", font_0002_l, fCB2); }.bind(this),
        // function(fCB2) { load("font_0003_li", font_0003_li, fCB2); }.bind(this),
        // function(fCB2) { load("font_0003_m", font_0003_m, fCB2); }.bind(this),
        // function(fCB2) { load("font_0003_i", font_0003_i, fCB2); }.bind(this),
        // function(fCB2) { load("font_0003_el", font_0003_el, fCB2); }.bind(this),
        // function(fCB2) { load("font_0003_eli", font_0003_eli, fCB2); }.bind(this),
      ],
      function (err, results)
      {
        console.log("_main: loadFonts: done");
        fCB();
      }.bind(this)
    );
  };
};

////////////////////////////////////
///// WEB COMPONENT DEFINITION /////
////////////////////////////////////

customElements.define('broke0000-main', Main);


/////////////////////////
///// INSTANTIATION /////
/////////////////////////

const _main = new Main();


// Log out just for main.js
console.log(`
////////////////////////////////////////////////////////////
//////////////////////////.        /////////////////////////
/////////////////////     .      ..  ...////////////////////
///////////////////    ..  .   ....    .  ./////////////////
//////////////////        . .  . ...  . ... ////////////////
/////////////////     ...................   ////////////////
/////////////////  .(,(/.%,.*%#&&&.//....   ////////////////
/////////////////  .***/..*,*/%,%%#%*/(/(. ,* //////////////
////////////////( ******  #%#((&%%*&///%%*..(.//////////////
/////////////////(/,((//**&.*,%%(*//.**##, .#(//////////////
///////////////( .(,**....* ...,*,,,%&,((*.* .//////////////
///////////////( . **..(*#/ %%%%#,*##,..*%,,.///////////////
////////////////(.,#/%#%%,#(%#(/&&(%,(.//#,..///////////////
//////////////////(,,/*#(.#/ /(&..%/&/(*(.//////////////////
///////////////////( ***#     .,.,/&%%%*.///////////////////
////////////////////(./,/*,,.,&*(((%%(/ ////////////////////
///////////////////////**.*.*//##.*,,,//////////////////////
///////////////////////  ,*%%/@//(*   ./////////////////////
//////////////////////                 /////////////////////
////////////////////                     ///////////////////

_main: build id: ` + BUILD_ID +``);