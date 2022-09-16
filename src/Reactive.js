const createElement = (type,  attributes = {}, ...children) => {
  const element = document.createElement(type);
  Object.keys(attributes || {}).forEach(key => {
    (key === "style" ? (
      Object.keys(attributes[key]).forEach(attr => {
        element.style[attr] = attributes[key][attr];
      })
    ) 
      : (key !== "style") ? (
        (key === "className") ? (
          element.setAttribute('class', attributes[key])
        )
        : element.setAttribute(key, attributes[key])
      )
      : 
    (element[key] = attributes[key]))
  })

  const processChildren = (child) => {
    (Array.isArray(child) ? (
      child.forEach(sibling => processChildren(sibling))
    ) : (typeof child === 'object') ? (
      element.appendChild(child)
    )
        : (typeof child === 'function' ) ? (
          processChildren(child)
        )
      : element.appendChild(document.createTextNode(child))
    )
  }

  (children || []).forEach(ch => processChildren(ch));

  return element;
}

const addEvent = (element) => {

}

let globalId = 0;
let componentState = new Map();
let globalParent;

const useState = (initialState) => {
  const id = globalId;
  const parent = globalParent;
  globalId++;
  return (() => {
    const { stateData} = componentState.get(parent);
  
      if (stateData[id] === null ) 
        (stateData[id] = { value: (typeof initialState === 'function' ? initialState() : initialState ) })
  
    const setState = state => {
      const {props, element } =  componentState.get(parent);
      (typeof state === 'function' ?
        (stateData[id].value = state(stateData[id].value))
        : (stateData[id].value = state)
        )
  
      renderToDom(element, props, parent);
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

const renderToDom = (element, props, container, olDom) => {
  console.log(element.type);
  let state = componentState.get(container) || { stateData: [] }
  componentState.set(container, { ...state, element, props });
  globalParent = container;
  globalId = 0;
  (container && element) && (container.appendChild(element))
}


const ReactiveJs = (function () {
  return {
    renderToDom,
    createElement,
  }
})()



/** @jsx ReactiveJs.createElement */


console.log(ReactiveJs.createElement)


const container = document.querySelector(".root");
console.log("container: ", container);

ReactiveJs.renderToDom((
<div style={{fontWeight: "bold"}} onClick={() => console.log('CLICKED')} className={"hello"}>
    hey thats fucking boring
  </div>
),
  {},
  container);