(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.vegaTooltip = {})));
}(this, (function (exports) { 'use strict';

  // generated with build-style.sh
  var defaultStyle = `#vg-tooltip-element {
  visibility: hidden;
  padding: 8px;
  position: fixed;
  z-index: 1000;
  font-family: sans-serif;
  font-size: 11px;
  border-radius: 3px;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.1);

  /* The default theme is the light theme. */
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #d9d9d9;
  color: black;
}
#vg-tooltip-element.visible {
  visibility: visible;
}
#vg-tooltip-element h2 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 13px;
}
#vg-tooltip-element table {
  border-spacing: 0;
}
#vg-tooltip-element td {
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 2px;
  padding-bottom: 2px;
}
#vg-tooltip-element td.key {
  color: #808080;
  max-width: 150px;
  text-align: right;
  padding-right: 4px;
}
#vg-tooltip-element td.value {
  display: block;
  max-width: 300px;
  max-height: 7em;
  text-align: left;
}

/* Dark and light color themes */
#vg-tooltip-element.dark-theme {
  background-color: rgba(32, 32, 32, 0.9);
  border: 1px solid #f5f5f5;
  color: white;
}
#vg-tooltip-element.dark-theme td.key {
  color: #bfbfbf;
}

#vg-tooltip-element.light-theme {
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #d9d9d9;
  color: black;
}
#vg-tooltip-element.light-theme td.key {
  color: #808080;
}`;

  const EL_ID = 'vg-tooltip-element';
  const DEFAULT_OPTIONS = {
      /**
       * X offset.
       */
      offsetX: 10,
      /**
       * Y offset.
       */
      offsetY: 10,
      /**
       * ID of the tooltip element.
       */
      id: EL_ID,
      /**
       * ID of the tooltip CSS style.
       */
      styleId: 'vega-tooltip-style',
      /**
       * The name of the theme. You can use the CSS class called [THEME]-theme to style the tooltips.
       *
       * There are two predefined themes: "light" (default) and "dark".
       */
      theme: 'light',
      /**
       * Do not use the default styles provided by Vega Tooltip. If you enable this option, you need to use your own styles. It is not necessary to disable the default style when using a custom theme.
       */
      disableDefaultStyle: false,
      /**
       * HTML sanitizer function that removes dangerous HTML to prevent XSS.
       *
       * This should be a function from string to string. You may replace it with a formatter such as a markdown formatter.
       */
      sanitize: escapeHTML,
      /**
       * The maximum recursion depth when printing objects in the tooltip.
       */
      maxDepth: 2,
  };
  /**
   * Escape special HTML characters.
   *
   * @param value A value to convert to string and HTML-escape.
   */
  function escapeHTML(value) {
      return String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;');
  }
  function createDefaultStyle(id) {
      // Just in case this id comes from a user, ensure these is no security issues
      if (!/^[A-Za-z]+[-:.\w]*$/.test(id)) {
          throw new Error('Invalid HTML ID');
      }
      return defaultStyle.toString().replace(EL_ID, id);
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
              t[p[i]] = s[p[i]];
      return t;
  }

  function accessor(fn, fields, name) {
    fn.fields = fields || [];
    fn.fname = name;
    return fn;
  }

  function error(message) {
    throw Error(message);
  }

  function splitAccessPath(p) {
    var path = [],
        q = null,
        b = 0,
        n = p.length,
        s = '',
        i, j, c;

    p = p + '';

    function push() {
      path.push(s + p.substring(i, j));
      s = '';
      i = j + 1;
    }

    for (i=j=0; j<n; ++j) {
      c = p[j];
      if (c === '\\') {
        s += p.substring(i, j);
        i = ++j;
      } else if (c === q) {
        push();
        q = null;
        b = -1;
      } else if (q) {
        continue;
      } else if (i === b && c === '"') {
        i = j + 1;
        q = c;
      } else if (i === b && c === "'") {
        i = j + 1;
        q = c;
      } else if (c === '.' && !b) {
        if (j > i) {
          push();
        } else {
          i = j + 1;
        }
      } else if (c === '[') {
        if (j > i) push();
        b = i = j + 1;
      } else if (c === ']') {
        if (!b) error('Access path missing open bracket: ' + p);
        if (b > 0) push();
        b = 0;
        i = j + 1;
      }
    }

    if (b) error('Access path missing closing bracket: ' + p);
    if (q) error('Access path missing closing quote: ' + p);

    if (j > i) {
      j++;
      push();
    }

    return path;
  }

  var isArray = Array.isArray;

  function isObject(_) {
    return _ === Object(_);
  }

  function isString(_) {
    return typeof _ === 'string';
  }

  function $(x) {
    return isArray(x) ? '[' + x.map($) + ']'
      : isObject(x) || isString(x) ?
        // Output valid JSON and JS source strings.
        // See http://timelessrepo.com/json-isnt-a-javascript-subset
        JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
      : x;
  }

  function field(field, name) {
    var path = splitAccessPath(field),
        code = 'return _[' + path.map($).join('][') + '];';

    return accessor(
      Function('_', code),
      [(field = path.length===1 ? path[0] : field)],
      name || field
    );
  }

  var empty = [];

  var id = field('id');

  var identity = accessor(function(_) { return _; }, empty, 'identity');

  var zero = accessor(function() { return 0; }, empty, 'zero');

  var one = accessor(function() { return 1; }, empty, 'one');

  var truthy = accessor(function() { return true; }, empty, 'true');

  var falsy = accessor(function() { return false; }, empty, 'false');

  /**
   * Format the value to be shown in the toolip.
   *
   * @param value The value to show in the tooltip.
   * @param valueToHtml Function to convert a single cell value to an HTML string
   */
  function formatValue(value, valueToHtml, maxDepth) {
      if (isArray(value)) {
          return `[${value.map(v => valueToHtml(isString(v) ? v : stringify(v, maxDepth))).join(', ')}]`;
      }
      if (isObject(value)) {
          let content = '';
          const _a = value, { title } = _a, rest = __rest(_a, ["title"]);
          if (title) {
              content += `<h2>${valueToHtml(title)}</h2>`;
          }
          const keys = Object.keys(rest);
          if (keys.length > 0) {
              content += '<table>';
              for (const key$$1 of keys) {
                  let val = rest[key$$1];
                  if (isObject(val)) {
                      val = stringify(val, maxDepth);
                  }
                  content += `<tr><td class="key">${valueToHtml(key$$1)}:</td><td class="value">${valueToHtml(val)}</td></tr>`;
              }
              content += `</table>`;
          }
          return content || '{}'; // show empty object if there are no properties
      }
      return valueToHtml(value);
  }
  function replacer(maxDepth) {
      const stack = [];
      return function (key$$1, value) {
          if (typeof value !== 'object' || value === null) {
              return value;
          }
          const pos = stack.indexOf(this) + 1;
          stack.length = pos;
          if (stack.length > maxDepth) {
              return '[Object]';
          }
          if (stack.indexOf(value) >= 0) {
              return '[Circular]';
          }
          stack.push(value);
          return value;
      };
  }
  /**
   * Stringify any JS object to valid JSON
   */
  function stringify(obj, maxDepth) {
      return JSON.stringify(obj, replacer(maxDepth));
  }

  /**
   * Position the tooltip
   *
   * @param event The mouse event.
   * @param tooltipBox
   * @param offsetX Horizontal offset.
   * @param offsetY Vertical offset.
   */
  function calculatePosition(event, tooltipBox, offsetX, offsetY) {
      let x = event.clientX + offsetX;
      if (x + tooltipBox.width > window.innerWidth) {
          x = +event.clientX - offsetX - tooltipBox.width;
      }
      let y = event.clientY + offsetY;
      if (y + tooltipBox.height > window.innerHeight) {
          y = +event.clientY - offsetY - tooltipBox.height;
      }
      return { x, y };
  }

  /**
   * The tooltip handler class.
   */
  class Handler {
      /**
       * Create the tooltip handler and initialize the element and style.
       *
       * @param options Tooltip Options
       */
      constructor(options) {
          this.options = Object.assign({}, DEFAULT_OPTIONS, options);
          const elementId = this.options.id;
          // bind this to call
          this.call = this.tooltip_handler.bind(this);
          // prepend a default stylesheet for tooltips to the head
          if (!this.options.disableDefaultStyle && !document.getElementById(this.options.styleId)) {
              const style = document.createElement('style');
              style.setAttribute('id', this.options.styleId);
              style.innerHTML = createDefaultStyle(elementId);
              const head = document.head; // yes, we expect the document to have a head
              if (head.childNodes.length > 0) {
                  head.insertBefore(style, head.childNodes[0]);
              }
              else {
                  head.appendChild(style);
              }
          }
          // append a div element that we use as a tooltip unless it already exists
          this.el = document.getElementById(elementId);
          if (!this.el) {
              this.el = document.createElement('div');
              this.el.setAttribute('id', elementId);
              this.el.classList.add('vg-tooltip');
              document.body.appendChild(this.el);
          }
      }
      /**
       * The tooltip handler function.
       */
      tooltip_handler(handler, event, item, value) {
          // console.log(handler, event, item, value);
          // hide tooltip for null, undefined, or empty string values
          if (value == null || value === '') {
              this.el.classList.remove('visible', `${this.options.theme}-theme`);
              return;
          }
          // set the tooltip content
          this.el.innerHTML = formatValue(value, this.options.sanitize, this.options.maxDepth);
          // make the tooltip visible
          this.el.classList.add('visible', `${this.options.theme}-theme`);
          const { x, y } = calculatePosition(event, this.el.getBoundingClientRect(), this.options.offsetX, this.options.offsetY);
          this.el.setAttribute('style', `top: ${y}px; left: ${x}px`);
      }
  }

  /**
   * Create a tooltip handler and register it with the provided view.
   *
   * @param view The Vega view.
   * @param opt Tooltip options.
   */
  function index (view, opt) {
      const handler = new Handler(opt);
      view.tooltip(handler.call).run();
      return handler;
  }

  exports.default = index;
  exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
  exports.escapeHTML = escapeHTML;
  exports.createDefaultStyle = createDefaultStyle;
  exports.formatValue = formatValue;
  exports.replacer = replacer;
  exports.stringify = stringify;
  exports.calculatePosition = calculatePosition;
  exports.Handler = Handler;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vega-tooltip.js.map
