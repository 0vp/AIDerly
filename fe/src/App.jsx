import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Spline from '@splinetool/react-spline';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Spline scene="https://prod.spline.design/7wrBj9pRjOp01LZn/scene.splinecode" />

    </>
  )
}

export default App
