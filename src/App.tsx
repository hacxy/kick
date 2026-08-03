import { Routes, Route } from 'react-router-dom'

import { Layout } from './components/Layout'
import { Config } from './pages/Config'
import { Home } from './pages/Home'
import { Templates } from './pages/Templates'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="config" element={<Config />} />
        <Route path="templates" element={<Templates />} />
      </Route>
    </Routes>
  )
}

export default App
