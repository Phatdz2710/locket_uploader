import './App.css';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import SessionProvider from './contexts/SessionContext';
import UploadPage from './pages/UploadPage';

function App() {

  return (
    <SessionProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<UploadPage />} />
        </Routes>
      </HashRouter>
    </SessionProvider>
  );
}

export default App;