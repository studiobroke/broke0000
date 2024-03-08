///////////////////
///// IMPORTS /////
///////////////////

///// NPM
import { series } from "async";
import { gsap } from "gsap";

///// LOCAL
import { DOM } from "./../../_utils/DOM";

///// JS ASSETS
import sHTML from "./About.html";
import sCSS from "./About.css";


/////////////////
///// CLASS /////
/////////////////

class About extends HTMLElement
{
  components = Object.create(null);
  domShadowRoot = Object.create(null);

  constructor()
  {
    super();
    console.log("_about: constructor()");

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
        function(fCB) { this.createComponentInstances(fCB); }.bind(this),
        function(fCB) { this.createShadowDOM(fCB); }.bind(this),
        function(fCB) { this.populateShadowDOM(fCB); }.bind(this),
      ],
      function (err, results)
      {
        console.log("_about: __init: done");

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

    if (sCSS !== "")
    {
      const domTemplateCSS = document.createElement("template");
      domTemplateCSS.innerHTML = "<style>" + sCSS + "</style>";

      this.domShadowRoot.appendChild
      (
        domTemplateCSS.content.cloneNode(true)
      );
    };

    if (sHTML !== "")
    {
      const domTemplateHTML = document.createElement("template");
      domTemplateHTML.innerHTML = sHTML;

      this.domShadowRoot.appendChild
      (
        domTemplateHTML.content.cloneNode(true)
      );
    }

    DOM.append(this, document.body);

    fCB();
  };

  createComponentInstances(fCB)
  {
    series
    (
      [],
      function (err, results)
      {
        fCB();

      }.bind(this)
    );
  };

  populateShadowDOM(fCB)
  {

    fCB();
  };
};

////////////////////////////////////
///// WEB COMPONENT DEFINITION /////
////////////////////////////////////

customElements.define('broke0000-about', About);


/////////////////////////
///// INSTANTIATION /////
/////////////////////////

const _about = new About();