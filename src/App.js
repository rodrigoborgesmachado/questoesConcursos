import Footer from './components/Footer';
import RoutesApp from "./routes";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="app">
      <ToastContainer autoClose="2000"/>
      <RoutesApp/>
      <Footer/>
    </div>
  );
}

export default App;
