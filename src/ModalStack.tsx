import React, { useMemo, useState, useContext } from 'react'

export interface ModalStackValue {
  /**
   * Opens a modal using the provided component and props
   */
  openModal?: <T extends StackedModalProps, P>(
    component: React.ComponentType<T>,
    props?: P,
    options?: OpenModalOptions
  ) => any

  /**
   * Closes the active modal
   */
  closeModal?: () => void

  /**
   * Closes the number of modals
   */
  closeModals?: (amount?: number) => void

  /**
   * Closes all modals
   */
  closeAllModals?: () => void

  stack: StackedModal[]
}

export type OpenModalOptions = {
  /**
   * Replaces the active modal in the stack
   */
  replace?: boolean
}

export interface StackedModalProps {
  open?: boolean
}

export type StackedModal = {
  component: React.ComponentType
  props: any
}

const ModalStackContext = React.createContext<ModalStackValue>({} as any)

export interface ModalStackProps {
  renderModals?: React.ComponentType<ModalStackValue>
  children?: React.ReactNode
}

export default function ModalStack({
  children,
  renderModals: ModalsComponent = Modals,
}: ModalStackProps) {
  const [stack, setStack] = useState<StackedModal[]>([])

  const value = useMemo<ModalStackValue>(() => {
    function pop(amount = 1) {
      return setStack((prev) => [...prev].slice(0, prev.length - amount))
    }

    function dismissAll() {
      setStack([])
    }

    function dismiss(amount?: number) {
      if (stack.length === 1) {
        dismissAll()
      } else {
        pop(amount)
      }
    }

    return {
      stack,
      openModal: (component, props, options) => {
        setStack((prev) => {
          let newStack = [...prev]

          if (options?.replace) {
            newStack = stack.slice(0, stack.length - 1)
          }

          return [...newStack, { component, props } as StackedModal]
        })
      },
      closeModal: () => dismiss(1),
      closeModals: dismiss,
      closeAllModals: dismissAll,
    }
  }, [stack])

  return (
    <ModalStackContext.Provider value={value}>
      {children}
      <ModalsComponent {...value} />
    </ModalStackContext.Provider>
  )
}

function Modals({ stack }: ModalStackValue) {
  return (
    <>
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
  )
}

export function useModals() {
  return useContext(ModalStackContext)
}
