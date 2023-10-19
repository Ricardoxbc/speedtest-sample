import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'

function convertion2d(value) {
  const angle = value * 3.6 * 0.75
  const rad = (Math.PI / 180) * angle
  // console.log(angle, rad, value)
  const converted = { x: Math.cos(rad), y: Math.sin(rad) }
  return converted
}

function draw(c, value, target) {
  // c.moveTo(Math.floor(canvas.with / 2), canvas.height)
  c.font = '20px Arial'
  c.strokeStyle = '#000'
  c.fillStyle = '#000'
  c.lineWidth = 1

  const p = Math.PI
  const cmd = c.canvas.width / 2
  const md = cmd - 4
  const lineSize = md - 25

  c.clearRect(0, 0, c.canvas.width, c.canvas.height)

  c.beginPath()
  c.lineWidth = 4
  c.arc(cmd, cmd, md, p / 2 + p / 4, p / 4)
  for (let i = 0; i <= 10; i++) {
    const { x: a, y: b } = convertion2d(10 * i + 50)
    c.moveTo(cmd + a * (cmd - 10), cmd + b * (cmd - 10))
    c.lineTo(cmd + a * cmd, cmd + b * cmd)
  }
  c.stroke()
  c.moveTo(cmd, cmd)

  const { x: xc, y: yc } = convertion2d(value)
  const x = cmd + xc * lineSize
  const y = cmd + yc * lineSize

  c.lineWidth = 2
  console.log({ x, y, value })
  c.beginPath()
  c.lineTo(cmd - 6, cmd)
  c.lineTo(x, y)
  c.lineTo(cmd + 6, cmd)
  c.closePath()
  c.fill()
  c.stroke()

  const text = String(target)
  const { width: wtext } = c.measureText(text)
  c.fillText(text, cmd * 2 - wtext, cmd * 2 - wtext)
  c.fillText('0', 0, cmd * 2 - wtext)
}

function Canvas({ value, callback, target }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const c = canvas.getContext('2d')

    async function aux() {
      for (let i = 50; i < value + 50 - 1; i++) {
        draw(c, i, target)
        await sleep(10)
      }
      draw(c, value + 50, target)
    }

    aux()
  }, [value, target])

  return (
    <canvas
      className="cursor-pointer"
      ref={canvasRef}
      id="canvas"
      width={400}
      height={400}
      onClick={callback}
    ></canvas>
  )
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

Canvas.propTypes = {
  callback: PropTypes.func,
  target: PropTypes.number,
  value: PropTypes.number,
}

export default Canvas
