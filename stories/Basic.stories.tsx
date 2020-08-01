import React from 'react'
import { ModalStack, useModals } from '../src'

export default {
  title: 'Basic',
  decorators: [
    (Story) => (
      <ModalStack>
        <Story />
      </ModalStack>
    ),
  ],
}

export const Basic = () => {
  const { openModal } = useModals()

  return (
    <button
      onClick={() => {
        openModal(Modal)
      }}
    >
      Open Modal
    </button>
  )
}

export const Backdrop = () => {
  function OpenModalButton() {
    const { openModal } = useModals()

    return (
      <button
        onClick={() => {
          openModal(Modal)
        }}
      >
        Open Modal
      </button>
    )
  }

  return (
    <ModalStack
      renderModals={({ stack }) => (
        <>
          {stack.length > 0 && (
            <div
              style={{
                zIndex: 90,
                position: `fixed`,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.3)',
              }}
            />
          )}
          {stack.map((modal, index) => {
            return (
              <modal.component
                key={index}
                open={modal === stack[stack.length - 1]}
                {...modal.props}
              />
            )
          })}
        </>
      )}
    >
      <OpenModalButton />
    </ModalStack>
  )
}

function Modal({
  open,
  title = 'Hello',
  message = "I'm modal #1",
}: {
  open: boolean
  title?: string
  message?: string
}) {
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
            openModal(Modal, {
              title: `Hello`,
              message: `I'm modal #${stack.length + 1}`,
            })
          }}
        >
          Open another one!
        </button>
        <button
          onClick={() => {
            closeModal()
          }}
        >
          Close me
        </button>
      </div>
    </div>
  )
}
