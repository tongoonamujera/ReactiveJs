const createElement = (type,  attributes = {}, ...children) => {
  const element = [...children].forEach(child => {
    if (child !== null && child !== false && child !== true) {
      (typeof child === 'object' ?
        (child)
        : createElement("text", {textContent: child})
      )
    }
  })

  return {
    type,
    children: element,
    props: Object.assign({ children: element }, attributes),
  }
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

const renderToDom = (element, props, container) => {
  let state = componentState.get(container) || { stateData: [] }
  componentState.set(container, { ...state, element, props });
  globalParent = container;
  globalId = 0;
  container.innerHtml = element;
}


const Reactive = {
  renderToDom,
  createElement,
}

Reactive.createElement