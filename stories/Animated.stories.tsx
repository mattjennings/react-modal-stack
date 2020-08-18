import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { ModalStack, useModals } from '../src'

export default {
  title: 'Animated',
  decorators: [
    (Story) => (
      <ModalStack renderModals={AnimatedModals}>
        <Story />
      </ModalStack>
    ),
  ],
}

export const FramerMotion = () => {
  const { openModal } = useModals()
  return (
    <button
      onClick={() => {
        openModal(AnimatedModal)
      }}
    >
      Open Modal
    </button>
  )
}

function AnimatedModals({ stack }) {
  // the "displayed" stack which will be a lagged version of stack
  // in order to animate the transitions between modals
  const [displayedStack, setDisplayedStack] = useState(stack)

  // track the "open" state manually so we can dismiss the
  // top modal before popping it off the stack
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // we're opening the first modal, so update the stack right away
    if (stack.length === 1 && displayedStack.length === 0) {
      setOpen(true)
      setDisplayedStack(stack)
    }
    // stack updated, trigger a dismissal of the current modal
    else {
      setOpen(false)
    }
  }, [stack])

  return (
    <>
      <AnimatePresence>
        {stack.length > 0 && (
          <motion.div
            style={{
              zIndex: 90,
              position: `fixed`,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
            }}
            variants={{
              show: { opacity: 1 },
              hide: { opacity: 0 },
            }}
            initial="hide"
            animate="show"
            exit="hide"
          />
        )}
      </AnimatePresence>
      {displayedStack.map((modal, index) => (
        <modal.component
          key={index}
          open={index === displayedStack.length - 1 && isOpen}
          onAnimationComplete={() => {
            // set open state for next modal
            if (stack.length > 0) {
              setOpen(true)
            } else {
              setOpen(false)
            }

            // update displayed stack
            // setTimeout is a hack to prevent a warning about updating state
            // in an unmounted component (I can't figure out why it happens, or why this fixes it)
            setTimeout(() => setDisplayedStack(stack))

            modal.props?.onAnimationComplete?.()
          }}
          {...modal.props}
        />
      ))}
    </>
  )
}

type AnimatedModalProps = {
  open: boolean
  title?: string
  message?: string
}

function AnimatedModal({
  open,
  message = `I'm modal #1`,
  title = 'Hello',
  ...props
}: AnimatedModalProps) {
  const { stack, openModal, closeModal } = useModals()

  const [value, setValue] = useState('')

  return (
    <AnimatePresence>
      {open && (
        <motion.div
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
          variants={{
            show: {
              opacity: 1,
              scale: 1,
            },
            hide: {
              opacity: 0,
              scale: 0,
            },
          }}
          initial="hide"
          animate="show"
          exit="hide"
          {...props}
        >
          <motion.div
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
            <input
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
            />
            <br />
            <br />
            <button
              onClick={() => {
                openModal(AnimatedModal, {
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
