import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

// pages
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <h1>The Ninja Clothing Company</h1>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
        </nav>
        {/* Switch -> Routes */}
        {/* exact 變成預設行為的 props，不用特別添加 */}
        {/* component 棄用，改用 element，並且傳入的只能是 JSX，不像 Component 傳入模組化的變數 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/test" element={(
            <div>
              <h2>Test page</h2>
            </div>
          )} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App