const createElement = (type,  attributes = {}, ...props) => {
  return props
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

const useEffect = () => {

}

const renderToDom = (element, props, container) => {
  let state = componentState.get(container) || { stateData: [] }
  componentState.set(container, { ...state, element, props });
  globalParent = container;
  globalId = 0
  container.innerHtml = element;
}


const Reactive = {
  renderToDom,
  createElement,
}

Reactive.createElement