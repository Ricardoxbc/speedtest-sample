import { useEffect, useRef, useState } from 'react'
import './App.css'
import ArrowButton from './components/ArrowButton'
import { getInitialValue, submitConfig, submitValue } from './services/firebase'
import confetti from 'js-confetti'
import Canvas from './components/Canvas'

function App() {
  const STEP_DEFAULT = 50
  const TARGET_DEFAULT = 1000
  const convertion = (v, t) => {
    const conv = (v / t) * 100
    return conv <= 100 ? conv : 100
  }

  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState(0)
  const [leftValue, setLeftValue] = useState(0)
  const [rightValue, setRightValue] = useState(0)

  const [steps, setSteps] = useState(STEP_DEFAULT)
  const [target, setTarget] = useState(TARGET_DEFAULT)

  const stepsInRef = useRef()
  const targetInRef = useRef()

  useEffect(() => {
    getInitialValue().then((data) => {
      setValue(data.value)
      if (stepsInRef.current && targetInRef.current) {
        stepsInRef.current.value = data.steps
        targetInRef.current.value = data.target
        setSteps(data.steps)
        setTarget(data.target)
      }
      setLoading(false)
    })
  }, [])

  const leftCallback = (adding) => {
    setRightValue(0)
    setLeftValue((prev) => {
      if (adding && prev + steps > value) return prev
      if (adding) return prev + steps

      return prev - steps < 0 ? 0 : prev - steps
    })
  }

  const rightCallback = (adding) => {
    setLeftValue(0)
    setRightValue((prev) => {
      if (adding) {
        return prev + steps
      }
      return prev - steps < 0 ? 0 : prev - steps
    })
  }

  // const submitValueToFirebase = (add, value) => {
  const submitValueToFirebase = () => {
    const processedValue = rightValue - leftValue
    if (processedValue === 0) return
    // const processedValue = Math.abs(value) * (add ? 1 : -1)
    setLoading(true)
    submitValue(processedValue)
      .then((v) => {
        setValue(v)
        setLeftValue(0)
        setRightValue(0)
        setLoading(false)
        if (v >= target && leftValue === 0) {
          new confetti().addConfetti()
        }
      })
      .catch(console.error)
  }

  const submitConfigToFirebase = () => {
    const stepsIn = stepsInRef.current
    const targetIn = targetInRef.current
    if (!stepsIn || !targetIn) return

    setLoading(true)
    submitConfig({
      steps: parseInt(stepsIn.value) || 50,
      target: parseInt(targetIn.value) || 1000,
    }).then((res) => {
      if (!res.result) {
        stepsIn.value = 50
        targetIn.value = 1000
        setLoading(false)
        return
      }
      setSteps(res.steps)
      setTarget(res.target)
      setLoading(false)
    })
  }

  return (
    <>
      <header className="header">
        <div>
          <button onClick={submitConfigToFirebase}>Steps</button>
          <input
            ref={stepsInRef}
            type="number"
            placeholder="Steps"
            autoComplete="false"
          />
        </div>
        <div className="">
          <input
            ref={targetInRef}
            type="number"
            placeholder="Target"
            autoComplete="false"
          />
          <button onClick={submitConfigToFirebase}>Target</button>
        </div>
      </header>
      <main>
        <section className="left">
          <ArrowButton callback={leftCallback} adding={true}>
            +
          </ArrowButton>
          <div className="form-control">
            <input type="number" readOnly value={leftValue} />
          </div>
          <ArrowButton callback={leftCallback} adding={false}>
            -
          </ArrowButton>
        </section>
        <section className="center">
          <h2>Target</h2>
          <Canvas
            value={convertion(value, target)}
            callback={submitValueToFirebase}
            target={target}
          />
          <div className="form-control">
            <h3>{value}</h3>
          </div>
        </section>

        <section className="right">
          <ArrowButton callback={rightCallback} adding={true}>
            +
          </ArrowButton>
          <div className="form-control">
            <input type="number" readOnly value={rightValue} />
          </div>
          <ArrowButton callback={rightCallback} adding={false}>
            -
          </ArrowButton>
        </section>
      </main>
      <div
        className="modal"
        style={{ display: loading ? 'flex' : 'none' }}
      ></div>
    </>
  )
}

export default App
