# react-modal-stack

A simple, flexible, zero-dependency modal stack manager for React.

![GIF Preview](https://media.giphy.com/media/cnVra4LzHe1LWN5qpq/giphy.gif)

## Install

```
npm install @mattjennings/react-modal-stack
```

## Usage

Add `<ModalStack />` to the root of your App

```jsx
import React from 'react'
import { ModalStack } from '@mattjennings/react-modal-stack'
import App from './App'

React.render(
  <ModalStack>
    <App />
  </ModalStack>,
  document.querySelector('#root')
)
```

Create a Modal component. It doesn't matter how you style it, it just needs to receive an `open` prop.

```jsx
function Modal({ open, title, message }) {
  const { stack, openModal, closeModal } = useModals()

  if (!open) {
    return null
  }

  return (
    <div
      style={{
        zIndex: 100,
        position: `fixed`,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: `flex`,
        justifyContent: `center`,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 400,
          height: 200,
          padding: '0 16px',
          borderRadius: '10px',
          background: 'white',
          border: '1px solid #e5e5e5',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <h2>{title}</h2>
        <p>{message}</p>
        <button
          onClick={() => {
            closeModal()
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
```

Open the modal

```jsx
import React from 'react'
import { useModals } from '@mattjennings/react-modal-stack'
import Modal from './Modal'

function OpenModal() {
  const { openModal } = useModals()

  return (
    <button
      onClick={() => {
        openModal(Modal, {
          title: 'Hello',
          message: 'This is your modal',
        })
      }}
    >
      Open Modal
    </button>
  )
}
```

## Animating

`ModalStack` provides a `renderModals` prop to take control of rendering the modals. This lets you use a library like [framer-motion](https://github.com/framer/motion) to animate your transitions between modals.

See the [framer-motion example]() to see how it works.

## API

#### `<ModalStack />`

| Props        | Type                           | Description                                                                                             |
| ------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| renderModals | ({ stack }) => React.ReactNode | If you want to take control on how the modals are rendered (eg. adding animations), you can do so here. |

#### `useModals()`

| Method                                               | Description                                                                                                                                                                |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openModal(component, props, options?: { replace })` | Opens the component provided as the modal. <br /><br />If `replace: true` is provided for `options`, it will dismiss & replace the currently displayed modal in the stack. |
| `closeModal`                                         | Dismisses the current modal                                                                                                                                                |
| `closeModals(amount)`                                | Dismisses the amount of modals off the stack                                                                                                                               |
| `closeAllModals()`                                   | Dismisses all modals                                                                                                                                                       |
| `stack`                                              | The current stack of modals                                                                                                                                                |
