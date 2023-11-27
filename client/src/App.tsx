import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navi from './components/Navi';
import Holder from './pages/Holder';
import Home from './pages/Home';
import Issuer from './pages/Issuer';
import Verifier from './pages/Verifier';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className='app'>
        <Navi />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issuer" element={<Issuer />} />
          <Route path="/holder" element={<Holder />} />
          <Route path="/verifier" element={<Verifier />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
