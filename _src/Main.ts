///////////////////
///// IMPORTS /////
///////////////////

// NPM
import { series } from "async";
import { gsap } from "gsap";

// LOCAL
import { DOM } from "./_utils/DOM";

// CSS ASSETS
// import font_0001_r from "./_assets/_fonts/font_0001_r.woff2";

// COMPONENTS
// TODO: should we do this based on a routing component? only include what we need for this hard-refresh?
// import Home from "./pages/home/Home";
// import About from "./pages/about/About";

/////////////////
///// CLASS /////
/////////////////

class Main extends HTMLElement
{

  components = Object.create(null);
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
    series
    (
      [
        // function(fCB) { ENV.detectGPU(fCB); }.bind(this),
        // function(fCB) { this.loadFonts(fCB); }.bind(this),
        function(fCB) { this.createComponentInstances(fCB); }.bind(this),
        function(fCB) { this.createShadowDOM(fCB); }.bind(this),
        function(fCB) { this.populateShadowDOM(fCB); }.bind(this),
      ],
      function (err, results)
      {
        console.log("_main: __init: done");

        // TODO?: refac this?
        // Handle the color of the body here instead of CSS, so we don't get a flash on first paint.
        // The delay prevents an ugly blend with the component .intro() animations.
        // gsap.fromTo
        // (
        //   document.body,
        //   { backgroundColor: "rgb(255, 255, 255)"}, // start from here to avoid an ungly transition using just gsap.to
        //   { backgroundColor: "rgb(253, 245, 229)", duration: .900, delay: 0.0, ease: "none" },
        // );
      }.bind(this)
    );
  };

  ///////////////////////////////
  ///// __INIT CONTROL FLOW /////
  ///////////////////////////////

  createShadowDOM(fCB)
  {
    this.domShadowRoot = this.attachShadow
    (
      {
        mode: "open"
      }
    );

    // if (sCSS !== "")
    // {
    //   const domTemplateCSS = document.createElement("template");
    //   domTemplateCSS.innerHTML = "<style>" + sCSS + "</style>";

    //   this.domShadowRoot.appendChild
    //   (
    //     domTemplateCSS.content.cloneNode(true)
    //   );
    // };

    // if (sHTML !== "")
    // {
    //   const domTemplateHTML = document.createElement("template");
    //   domTemplateHTML.innerHTML = sHTML;

    //   this.domShadowRoot.appendChild
    //   (
    //     domTemplateHTML.content.cloneNode(true)
    //   );
    // }

    DOM.append(this, document.body);

    fCB();
  };

  // loadFonts(fCB)
  // {
  //   const load = function(sFontFace, sFontFacePath, fCB2)
  //   {
  //     const fontFace = new FontFace(sFontFace, "url(" + sFontFacePath + ")");
  //     fontFace.load()
  //     .then
  //     (function(loadedFont)
  //       {
  //         document.fonts.add(loadedFont);

  //         fCB2()
  //       }
  //     );
  //   };

  //   series
  //   (
  //     [
  //       // TODO: check if we use all these
  //       function(fCB2) { load("font_0001_r", font_0001_r, fCB2); }.bind(this),
  //       function(fCB2) { load("font_0002_r", font_0002_r, fCB2); }.bind(this),
  //       function(fCB2) { load("font_0002_l", font_0002_l, fCB2); }.bind(this),
  //       function(fCB2) { load("font_0003_li", font_0003_li, fCB2); }.bind(this),
  //       function(fCB2) { load("font_0003_m", font_0003_m, fCB2); }.bind(this),
  //       function(fCB2) { load("font_0003_i", font_0003_i, fCB2); }.bind(this),
  //       function(fCB2) { load("font_0003_el", font_0003_el, fCB2); }.bind(this),
  //       function(fCB2) { load("font_0003_eli", font_0003_eli, fCB2); }.bind(this),
  //     ],
  //     function (err, results)
  //     {
  //       console.log("_main: loadFonts: done");
  //       fCB();
  //     }.bind(this)
  //   );
  // };

  createComponentInstances(fCB)
  {
    // TODO: should we do this based on a routing component? only include what we need for this hard-refresh?

    series
    (
      [
        // function(fCB) { this.components._home = new Home(fCB); }.bind(this),\
        // function(fCB) { this.components._about = new About(fCB); }.bind(this),

        // function(fCB) { this.components._webGL = new WebGL(fCB); }.bind(this),
        // function(fCB) { this.components._header = new Header(fCB); }.bind(this),
        // function(fCB) { this.components._acknowledgement = new Acknowledgement(fCB); }.bind(this),
        // function(fCB) { this.components._curriculumvitae = new Curriculumvitae(fCB); }.bind(this),
        // function(fCB) { this.components._casestudyGorillaz = new Casestudy(fCB, "Gorillaz"); }.bind(this),
        // function(fCB) { this.components._casestudyGoogleEarthStudio = new Casestudy(fCB, "GoogleEarthStudio"); }.bind(this),
        // function(fCB) { this.components._footer = new Footer(fCB); }.bind(this),

      ],
      function (err, results)
      {
        fCB();

      }.bind(this)
    );
    // this.components._webGL = new WebGL();
  };

  populateShadowDOM(fCB)
  {
    // DOM.append(this.components._home, this.domShadowRoot);
    // DOM.append(this.components._about, this.domShadowRoot);

    // DOM.append(this.components._webGL, this.domShadowRoot);
    // DOM.append(this.components._header, this.domShadowRoot);
    // DOM.append(this.components._acknowledgement, this.domShadowRoot);
    // DOM.append(this.components._curriculumvitae, this.domShadowRoot);
    // DOM.append(this.components._casestudyGorillaz, this.domShadowRoot);
    // DOM.append(this.components._casestudyGoogleEarthStudio, this.domShadowRoot);
    // DOM.append(this.components._footer, this.domShadowRoot);

    // DOM.append(this.components._webGL, this.domShadowRoot);

    
    // const domLink = DOM.create("a", { href: "/about" }, "helllllo");
    // DOM.append(domLink, this.domShadowRoot);

    fCB();
  };


  /////////////////////////
  ///// CLASS METHODS /////
  /////////////////////////

  /**
   * High performance way of determining if a component is in view.
   * By that we mean enough of it is visible to treat is as being active.
   * There's an optional arg for how much of the element should be visible before returning true.
   * - we rely on the offsetTop of the component, relative to the position of the Main component.
   * - this way we do not need to request a getBoundingClientRect.
   * - NOTE: this only works when the Main component is the direct parent of the component.
   * @param {object} sComponentInstance String referring to the name of the component instance (eg, "_header");
   */
  testComponentInView(sComponentInstance, nPercentageInView = 100)
  {
    const domComponent = this.components[sComponentInstance];

    let nDomComponentHeight = domComponent.offsetHeight;
    let nDomComponentTopOffsetY = domComponent.offsetTop;
    let nDomComponentBottomOffsetY = domComponent.offsetTop + nDomComponentHeight;

    let nViewportHeight = window.innerHeight;
    let nViewportTopOffsetY = window.scrollY;
    let nViewportBottomOffsetY = window.scrollY + nViewportHeight;

    // Ok. some part of our component is visible.
    if (nDomComponentTopOffsetY <= nViewportBottomOffsetY && nDomComponentBottomOffsetY >= nViewportTopOffsetY)
    {
      // TODO calc percentage of component visible

      return true;
    }
    else
    {
      return false;
    }
  }
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