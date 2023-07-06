import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Erro from './pages/Erro';
import Questoes from './pages/Questoes';
import Header from './components/Header';
import Materias from './pages/Materias';
import Bancas from './pages/Bancas';
import Simulado from './pages/Simulado';
import Login from './pages/Login';
import CriarUsuario from './pages/CriarUsuario';
import Ranking from './pages/Ranking';
import HistoricoUsuario from './pages/HistoricoUsuario';
import PerfilUsuario from './pages/PerfilUsuario';
import ListagemProvas from './pages/ListagemProvas';
import ListagemQuestoes from './pages/ListagemQuestoes';
import CadastraProva from './pages/CadastroProva';
import CadastraQuestao from './pages/CadastroQuestao';
import RecoveryPass from './pages/RecoveryPass';
import ResetPass from './pages/ResetPass';
import Admin from './pages/Admin';
import Config from './config.json';
import Resultado from './pages/ResultadoSimulado';
import HistoricoSimulado from './pages/HistoricoSimulado';

function RoutesApp(){
    return(
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/materias' element={<Materias/>}/>
                <Route path='/bancas' element={<Bancas/>}/>
                <Route path='/simulado' element={<Simulado/>}/>
                <Route path='/listagemprovas/:filtro' element={<ListagemProvas/>}/>
                <Route path='/prova/:filtro' element={<ListagemQuestoes/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/criarUsuario' element={<CriarUsuario/>}/>
                <Route path='/ranking' element={<Ranking/>}/>
                <Route path='/historico' element={<HistoricoUsuario/>}/>
                <Route path='/perfil' element={<PerfilUsuario/>}/>
                <Route path='/questoes/:filtro' element={<Questoes/>}/>
                <Route path='/cadastroProva' element={<CadastraProva/>}/>
                <Route path='/cadastraQuestao/:filtro' element={<CadastraQuestao/>}/>
                <Route path='/recoverypass' element={<RecoveryPass/>}/>
                <Route path='/resetpass/:guid' element={<ResetPass/>}/>
                <Route path='/resultadosimulado/:filtro' element={<Resultado/>}/>
                <Route path='/historicosimulado/' element={<HistoricoSimulado/>}/>
                {
                    localStorage.getItem(Config.ADMIN) === '1' ?
                    <Route path='/admin' element={<Admin/>}/>
                    :
                    <></>
                }
                <Route path='*' element={<Erro/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;