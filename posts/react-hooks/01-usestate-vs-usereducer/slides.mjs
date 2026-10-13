// React Hooks series #01 — useState vs useReducer
// Source: https://react.dev/reference/react/useState
//         https://react.dev/reference/react/useReducer
//         https://react.dev/learn/extracting-state-logic-into-a-reducer
export const meta = {
  slug: 'react-hooks-01-usestate-vs-usereducer',
  series: 'React Hooks · #01',
};

export const slides = [
  {
    type: 'cover',
    badge: 'React Hooks Series #01',
    titleHtml: '<span class="hl">useState</span><span class="vs">vs</span><span class="hl2">useReducer</span>',
    subtitle: 'What they do, how to write them, and **when to pick which** — explained simply, with examples.',
  },
  {
    kicker: 'First things first',
    title: 'What is state?',
    blocks: [
      { lead: 'State is a component\'s **memory**. When it changes, React **re-renders** the component with the new value.' },
      { list: [
        'Typing in an input → the ==input value==',
        'Clicking "Add to cart" → the ==cart items==',
        'Opening a modal → ==isOpen==',
      ] },
      { note: 'React gives you two hooks to manage it: `useState` and `useReducer`.' },
    ],
  },
  {
    kicker: 'useState · Syntax',
    title: 'One line to add state',
    blocks: [
      { code: { lang: 'ts', size: 25, src: `
const [state, setState] = useState<Type>(initialState);` } },
      { defs: [
        ['state', 'The current value for this render.'],
        ['setState', 'Updates the value **and** triggers a re-render.'],
        ['initialState', 'The value on the **first render** only. Ignored after that.'],
        ['<Type>', 'Optional — usually **inferred**. Add it when it can\'t be:\n`useState<User | null>(null)`'],
      ] },
    ],
  },
  {
    kicker: 'useState · Example',
    title: 'A simple counter',
    blocks: [
      { code: { file: 'Counter.tsx', size: 29, src: `
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // number

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}` } },
      { text: 'Click → `setCount` stores the new number → React re-renders → the button shows it.' },
    ],
  },
  {
    kicker: 'useState · 3 tips from the docs',
    title: 'Use it the right way',
    blocks: [
      { steps: [
        { title: 'New value depends on the old one? Pass a function', code: { lang: 'ts', size: 27, src: `setCount(c => c + 1); // ✅ uses the latest value` } },
        { title: 'Objects & arrays: replace, don\'t mutate', code: { lang: 'ts', size: 27, src: `
setUser({ ...user, name: 'Sara' }); // ✅ new object
user.name = 'Sara';                 // ❌ no re-render` } },
        { title: 'Expensive initial value? Pass the function itself', code: { lang: 'ts', size: 27, src: `
useState<Todo[]>(createTodos);   // ✅ runs once
useState<Todo[]>(createTodos()); // ❌ every render` } },
      ] },
    ],
  },
  {
    kicker: 'useReducer · Syntax',
    title: 'All update logic in one place',
    blocks: [
      { code: { lang: 'ts', size: 27, src: `
const [state, dispatch] = useReducer(
  reducer, initialArg, init?
);` } },
      { defs: [
        ['reducer', 'A pure function:\n`(state, action) => newState`'],
        ['initialArg', 'The starting state.'],
        ['init?', 'Optional. Builds the initial state from `initialArg`.'],
        ['dispatch', 'Send an **action** → React updates state and re-renders.'],
      ] },
      { note: 'TypeScript **infers** the types from your reducer.' },
    ],
  },
  {
    kicker: 'useReducer · Step 1',
    title: 'Write the reducer',
    blocks: [
      { code: { file: 'reducer.ts', lang: 'ts', size: 24, src: `
type State = { count: number };

type Action =
  | { type: 'incremented' }
  | { type: 'decremented' }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'incremented':
      return { count: state.count + 1 };
    case 'decremented':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
  }
}` } },
      { note: 'An **action** describes ==what happened==. The **reducer** decides ==how state changes==.' },
    ],
  },
  {
    kicker: 'useReducer · Step 2',
    title: 'Use it in the component',
    blocks: [
      { code: { file: 'Counter.tsx', size: 26, src: `
function Counter() {
  const [state, dispatch] =
    useReducer(reducer, { count: 0 });

  const add = () => dispatch({ type: 'incremented' });
  const reset = () => dispatch({ type: 'reset' });

  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={add}>+</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}` } },
      { note: 'Typo like `{ type: \'incremnted\' }`? TypeScript shows an **error** before you even run it.' },
    ],
  },
  {
    kicker: 'useReducer · Rules',
    title: 'Keep your reducer clean',
    blocks: [
      { list: [
        '**Pure:** same input → same output. No fetch, timers or other side effects.',
        '**Never mutate** state. Always return a new object or array.',
        'In Strict Mode, React calls it **twice** in development to catch mistakes.',
      ] },
      { code: { lang: 'ts', size: 27, src: `
// ❌ mutation
state.count++;
return state;

// ✅ new object
return { ...state, count: state.count + 1 };` } },
    ],
  },
  {
    kicker: 'Common gotcha (both hooks)',
    title: 'State is a snapshot',
    blocks: [
      { code: { lang: 'ts', size: 28, src: `
function handleClick() {
  setCount(count + 1); // or dispatch(...)
  console.log(count);  // 😮 still the OLD value
}` } },
      { lead: 'Setting state does **not** change the variable right away. The new value arrives on the **next render**.' },
      { note: 'Need the next value now? Calculate it yourself: `const next = count + 1;`' },
    ],
  },
  {
    kicker: 'Side by side',
    title: 'The differences',
    blocks: [
      { table: {
        head: ['', 'useState', 'useReducer'],
        rows: [
          ['Update with', '`setState(value)`', '`dispatch(action)`'],
          ['Logic lives', 'Spread across event handlers', 'In **one** reducer function'],
          ['Code size', 'Less code up front', 'More code up front'],
          ['Readability', 'Great for simple updates', 'Better for complex updates'],
          ['Debugging', 'Harder to see what changed', 'Log every action in one place'],
          ['Testing', 'Tied to the component', 'Pure function → test alone'],
        ],
      } },
    ],
  },
  {
    kicker: 'Decision time',
    title: 'When to use which?',
    blocks: [
      { cols: [
        { title: 'useState', items: [
          'Simple, independent values',
          'Booleans, strings, numbers',
          'Few ways to update',
          'e.g. `isOpen`, input text',
        ] },
        { title: 'useReducer', items: [
          'Many values change together',
          'Many handlers update the same state',
          'Next state depends on complex logic',
          'e.g. todo list, multi-step form',
        ] },
      ] },
      { rule: 'Start with ==useState==. Switch to ~~useReducer~~ when updates get hard to follow.' },
      { text: 'You can also **mix both** in the same component.' },
    ],
  },
  {
    type: 'outro',
    kicker: 'Recap',
    title: 'TL;DR',
    blocks: [
      { list: [
        '`useState` → simple values, quick to write.',
        '`useReducer` → complex logic, one place, easy to test.',
        'Both: never mutate, and state updates on the **next render**.',
      ] },
      { html: '<div class="next"><div class="label">Next in the series</div><strong>#02 — useEffect</strong>: syncing with the outside world</div>' },
      { html: '<div class="cta"><span>👍 Like</span><span>🔁 Repost</span><span>➕ Follow for #02</span></div>' },
    ],
  },
];
