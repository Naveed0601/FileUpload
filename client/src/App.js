import Apitest from './Apitest';
import './App.css';
import FileUpload from './Pages/FileUpload';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TextBox from './Pages/TextBox';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/*' element={<FileUpload />}></Route>
        <Route path='/apis' element={<Apitest />}></Route>
        <Route path='/chat' element={<TextBox />}></Route>
      </Routes>
    </Router>

  );
}

export default App;
