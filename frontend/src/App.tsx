import './App.css';
import Alert from './components/ui/Alert';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Products } from './Pages/Products';
import MenuBar from './layout/menuBar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MenuBar />}>
          <Route path="/" element={
            <Alert
              variant="success"
              title="Success!"
              message="This is a test message."
              showLink={false}
            />
          } />
          <Route path="/products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;