import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Erro from './pages/Erro';
import Questoes from './pages/Questoes';
import Header from './components/Header';
import Materias from './pages/Materias';
import Bancas from './pages/Bancas';
import Provas from './pages/Provas';
import Login from './pages/Login';
import CriarUsuario from './pages/CriarUsuario';
import Ranking from './pages/Ranking';
import AreaUsuario from './pages/AreaUsuario';
import HistoricoUsuario from './pages/HistoricoUsuario';

function RoutesApp(){
    return(
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/materias' element={<Materias/>}/>
                <Route path='/bancas' element={<Bancas/>}/>
                <Route path='/provas' element={<Provas/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/criarUsuario' element={<CriarUsuario/>}/>
                <Route path='/ranking' element={<Ranking/>}/>
                <Route path='/areausuario' element={<AreaUsuario/>}/>
                <Route path='/historico' element={<HistoricoUsuario/>}/>
                <Route path='/questoes/:filtro' element={<Questoes/>}/>
                <Route path='*' element={<Erro/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;