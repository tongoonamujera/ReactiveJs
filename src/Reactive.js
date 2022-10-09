const createElement = (type, attributes = {}, ...children) => {
  if (typeof type === "function") {
    return type(attributes)
  }
  return { type, attributes, children };
}

const processChildren = (vdom) => {
  let element;
  element = document.createElement(vdom.type);
  assignAttributes(element, vdom);
  if (typeof vdom === "string") { return document.createTextNode(vdom) }

  (vdom.children || []).forEach(child => {
    console.log(child)
    element.appendChild(processChildren(child))
  });
  
  return element;
}

// const diffingAlgo = (dom, vdom, parent) => {
//   if (dom) {
//     if (vdom.)
//   }
// }

const assignAttributes = (element, vdom) => {
  Object.keys(vdom.attributes || {}).forEach(key => {
    (key === "style" ? (
      Object.keys(vdom.attributes[key]).forEach(attr => {
        element.style[attr] = vdom.attributes[key][attr];
      })
    )
      : (key !== "style") ? (
        (isEvent(key)) ? (addEvent(element, key, vdom))
          : (key === "className") ? (
            element.setAttribute('class', vdom.attributes[key])
          )
            : element.setAttribute(key, vdom.attributes[key])
      )
        :
        (element[key] = vdom.attributes[key]))
  })
}

const isEvent = (eventName) => {
  return /^on/.test(eventName);
}

const addEvent = (element, eventName, vdom) => {
  const { attributes } = vdom;
  console.log(element)
  element.setAttribute(eventName, attributes[eventName])
  element.addEventListener(
    eventName.slice(2).toLowerCase(), attributes[eventName]
  )
}

let globalId = 0;
let componentState = new Map();
let globalParent;
let globalElement;

const useState = (initialState) => {
  const id = globalId;
  const parent = globalParent;
  console.log("parent :", componentState)
  globalId++;
  return (() => {
    let stateData = componentState.get(parent);

    if (stateData == null)
      (stateData[id] = { value: (typeof initialState === 'function' ? initialState() : initialState) })

    const setState = state => {
      const element = componentState.get(parent);
      (typeof state === 'function' ?
        (stateData[id].value = state(stateData[id].value))
        : (stateData[id].value = state)
      )

      renderToDom(globalElement, parent, null);
    }
    return [stateData[id].value, setState];
  })()
}

const useEffect = (callbackFn, deps) => {
  const id = globalId;
  const parent = globalParent;
  globalId++;
  (() => {
    const { stateData } = componentState.get(parent);

    if (stateData[id] === null)
      (stateData[id] = { deps: undefined })

    const depsChanged = deps == null || deps.some(
      (dep, i) => {
        return stateData[id].deps == null || stateData[id].deps[i] !== dep
      })

    if (depsChanged) {
      if (stateData[id] != null) stateData[id].cleanup()
      stateData[id].cleanup = callbackFn()
      stateData[id].deps = deps;
    }
  })()
}

const useMemo = (callbackFn, deps) => {
  const id = globalId;
  const parent = globalParent;
  globalId++;
  return (() => {
    const { stateData } = componentState.get(parent);

    if (stateData[id] === null)
      (stateData[id] = { deps: undefined })

    const depsChanged = deps == null || deps.some(
      (dep, i) => {
        return stateData[id].deps == null || stateData[id].deps[i] !== dep
      })

    if (depsChanged) {
      stateData[id].value = callbackFn();
      stateData[id].deps = deps;
    }

    return stateData[id].value
  })()
}

let currentApp
const renderToDom = (vdom, container, olDom) => {
  let state = componentState.get(container) || { stateData: {} }
  console.log(componentState)
  componentState.set(container, { ...state, element: document.createElement(vdom.type), props: vdom.attributes });
  globalParent = container;
  globalElement = vdom;
  globalId = 0;

  const finalApp = processChildren(vdom)

  currentApp ? container.replaceChild(finalApp, currentApp) : container.appendChild(finalApp);
  currentApp = finalApp;
}


const ReactiveJs = (function () {
  return {
    renderToDom,
    createElement,
  }
})()



console.log(ReactiveJs.createElement)

const App = () => {
  return (
    <div style={{ fontWeight: "bold" }} className={"hello"} onClick={() => alert("hey hey it's enough")}>
      apo
      <div className="inner">
        hello everyone
        <button onClick={() => alert("alert from inner") }>click Me</button>
      </div>
    </div>
  )
}


const container = document.querySelector(".root");
console.log("container: ", container);

ReactiveJs.renderToDom((
  <App />
),
  container, null);