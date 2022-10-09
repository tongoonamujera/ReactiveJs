"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createElement = function createElement(type) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (typeof type === "function") {
    return type(attributes);
  }

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    attributes: attributes,
    children: children
  };
};

var processChildren = function processChildren(vdom) {
  var element;
  element = document.createElement(vdom.type);
  assignAttributes(element, vdom);

  if (typeof vdom === "string") {
    return document.createTextNode(vdom);
  }

  (vdom.children || []).forEach(function (child) {
    console.log(child);
    element.appendChild(processChildren(child));
  });
  return element;
}; // const diffingAlgo = (dom, vdom, parent) => {
//   if (dom) {
//     if (vdom.)
//   }
// }


var assignAttributes = function assignAttributes(element, vdom) {
  Object.keys(vdom.attributes || {}).forEach(function (key) {
    key === "style" ? Object.keys(vdom.attributes[key]).forEach(function (attr) {
      element.style[attr] = vdom.attributes[key][attr];
    }) : key !== "style" ? isEvent(key) ? addEvent(element, key, vdom) : key === "className" ? element.setAttribute('class', vdom.attributes[key]) : element.setAttribute(key, vdom.attributes[key]) : element[key] = vdom.attributes[key];
  });
};

var isEvent = function isEvent(eventName) {
  return /^on/.test(eventName);
};

var addEvent = function addEvent(element, eventName, vdom) {
  var attributes = vdom.attributes;
  console.log(element);
  element.setAttribute(eventName, attributes[eventName]);
  element.addEventListener(eventName.slice(2).toLowerCase(), attributes[eventName]);
};

var globalId = 0;
var componentState = new Map();
var globalParent;
var globalElement;

var useState = function useState(initialState) {
  var id = globalId;
  var parent = globalParent;
  console.log("parent :", componentState);
  globalId++;
  return function () {
    var stateData = componentState.get(parent);
    if (stateData == null) stateData[id] = {
      value: typeof initialState === 'function' ? initialState() : initialState
    };

    var setState = function setState(state) {
      var element = componentState.get(parent);
      typeof state === 'function' ? stateData[id].value = state(stateData[id].value) : stateData[id].value = state;
      renderToDom(globalElement, parent, null);
    };

    return [stateData[id].value, setState];
  }();
};

var useEffect = function useEffect(callbackFn, deps) {
  var id = globalId;
  var parent = globalParent;
  globalId++;

  (function () {
    var _componentState$get = componentState.get(parent),
        stateData = _componentState$get.stateData;

    if (stateData[id] === null) stateData[id] = {
      deps: undefined
    };
    var depsChanged = deps == null || deps.some(function (dep, i) {
      return stateData[id].deps == null || stateData[id].deps[i] !== dep;
    });

    if (depsChanged) {
      if (stateData[id] != null) stateData[id].cleanup();
      stateData[id].cleanup = callbackFn();
      stateData[id].deps = deps;
    }
  })();
};

var useMemo = function useMemo(callbackFn, deps) {
  var id = globalId;
  var parent = globalParent;
  globalId++;
  return function () {
    var _componentState$get2 = componentState.get(parent),
        stateData = _componentState$get2.stateData;

    if (stateData[id] === null) stateData[id] = {
      deps: undefined
    };
    var depsChanged = deps == null || deps.some(function (dep, i) {
      return stateData[id].deps == null || stateData[id].deps[i] !== dep;
    });

    if (depsChanged) {
      stateData[id].value = callbackFn();
      stateData[id].deps = deps;
    }

    return stateData[id].value;
  }();
};

var currentApp;

var renderToDom = function renderToDom(vdom, container, olDom) {
  var state = componentState.get(container) || {
    stateData: {}
  };
  console.log(componentState);
  componentState.set(container, _objectSpread(_objectSpread({}, state), {}, {
    element: document.createElement(vdom.type),
    props: vdom.attributes
  }));
  globalParent = container;
  globalElement = vdom;
  globalId = 0;
  var finalApp = processChildren(vdom);
  currentApp ? container.replaceChild(finalApp, currentApp) : container.appendChild(finalApp);
  currentApp = finalApp;
};

var ReactiveJs = function () {
  return {
    renderToDom: renderToDom,
    createElement: createElement
  };
}();

console.log(ReactiveJs.createElement);

var App = function App() {
  return ReactiveJs.createElement("div", {
    style: {
      fontWeight: "bold"
    },
    className: "hello",
    onClick: function onClick() {
      return alert("hey hey it's enough");
    }
  }, "apo", ReactiveJs.createElement("div", {
    className: "inner"
  }, "hello everyone", ReactiveJs.createElement("button", {
    onClick: function onClick() {
      return alert("alert from inner");
    }
  }, "click Me")));
};

var container = document.querySelector(".root");
console.log("container: ", container);
ReactiveJs.renderToDom(ReactiveJs.createElement(App, null), container, null);