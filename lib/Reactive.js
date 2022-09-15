"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var createElement = function createElement(type) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var element = document.createElement(type);
  Object.keys(attributes || {}).forEach(function (key) {
    key === "style" ? Object.keys(attributes[key]).forEach(function (attr) {
      element.style[attr] = attributes[key][attr];
    }) : element[key] = attributes[key];
  });

  var processChildren = function processChildren(child) {
    Array.isArray(child) ? child.forEach(function (sibling) {
      return processChildren(sibling);
    }) : _typeof(child) === 'object' ? element.appendChild(child) : element.appendChild(document.createTextNode(child));
  };

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  (children || []).forEach(function (ch) {
    return processChildren(ch);
  });
  return element;
};

var globalId = 0;
var componentState = new Map();
var globalParent;

var useState = function useState(initialState) {
  var id = globalId;
  var parent = globalParent;
  globalId++;
  return function () {
    var _componentState$get = componentState.get(parent),
        stateData = _componentState$get.stateData;

    if (stateData[id] === null) stateData[id] = {
      value: typeof initialState === 'function' ? initialState() : initialState
    };

    var setState = function setState(state) {
      var _componentState$get2 = componentState.get(parent),
          props = _componentState$get2.props,
          element = _componentState$get2.element;

      typeof state === 'function' ? stateData[id].value = state(stateData[id].value) : stateData[id].value = state;
      renderToDom(element, props, parent);
    };

    return [stateData[id].value, setState];
  }();
};

var useEffect = function useEffect(callbackFn, deps) {
  var id = globalId;
  var parent = globalParent;
  globalId++;

  (function () {
    var _componentState$get3 = componentState.get(parent),
        stateData = _componentState$get3.stateData;

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
    var _componentState$get4 = componentState.get(parent),
        stateData = _componentState$get4.stateData;

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

var renderToDom = function renderToDom(element, props, container) {
  var state = componentState.get(container) || {
    stateData: []
  };
  componentState.set(container, _objectSpread(_objectSpread({}, state), {}, {
    element: element,
    props: props
  }));
  globalParent = container;
  globalId = 0;
  container && element && container.appendChild(element);
};

var ReactiveJs = function () {
  return {
    renderToDom: renderToDom,
    createElement: createElement
  };
}();
/** @jsx ReactiveJs.createElement */


console.log(ReactiveJs.createElement);
var container = document.querySelector(".root");
console.log("container: ", container);
ReactiveJs.renderToDom(ReactiveJs.createElement("div", {
  style: {
    fontWeight: "bold"
  }
}, "hey thats fucking boring"), {}, container);