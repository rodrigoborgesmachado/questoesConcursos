import RoutesApp from "./routes";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './auth/AuthProvider';
import { ThemeProvider } from './theme/ThemeProvider';

function App() {
  return (
    <div className="app">
      <ThemeProvider>
        <ToastContainer autoClose="2000"/>
        <AuthProvider>
          <RoutesApp/>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
