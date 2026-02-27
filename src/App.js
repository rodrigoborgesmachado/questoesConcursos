import RoutesApp from "./routes";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './auth/AuthProvider';

function App() {
  return (
    <div className="app">
      <ToastContainer autoClose="2000"/>
      <AuthProvider>
        <RoutesApp/>
      </AuthProvider>
    </div>
  );
}

export default App;
