import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Erro from './pages/Erro';
import Questoes from './pages/Questoes';
import Header from './components/Header';

function RoutesApp(){
    return(
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/questoes/:filtro' element={<Questoes/>}/>
                <Route path='*' element={<Erro/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;