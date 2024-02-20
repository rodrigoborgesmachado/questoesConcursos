import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Footer from './components/Footer';
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
import HistoricoUsuarioAdmin from './pages/Admin/HistoricoUsuario';
import Config from './config.json';
import Resultado from './pages/ResultadoSimulado';
import HistoricoSimulado from './pages/HistoricoSimulado';
import SimuladoSelecao from './pages/SimuladoSelecao';
import AtualizaSenha from './pages/AtualizaSenha';
import VerificadorUser from './pages/VerificadorUser';
import ConfirmeConta from './pages/ConfirmeConta';
import Contato from './pages/Contato/contato';
import NotasCorte from './pages/NotasCorte/notasCorte';
import CalculadoraEnem from './pages/CalculadoraEnem/calculadoraEnem';
import DashBoard from './pages/Admin/DashBoard/DashBoard';
import Logs from './pages/Admin/Logs/logs';
import Usuarios from './pages/Admin/Usuarios/Usuario';
import HistoricoTabuadaDivertida from './pages/Admin/HIstoricoTabuadaDivertida/HistoricoTabuadaDivertida';
import CadastroAvaliacao from './pages/CadastroAvaliacao/cadastroAvaliacao';
import MinhasAvaliacoes from './pages/MinhasAvaliacoes';
import ListagemAvaliacoes from './pages/ListagemAvaliacoes/listagemAvaliacoes';
import Avaliacao from './pages/Avaliacao';
import ResultadoAvaliacao from './pages/ResultadoAvaliacao/resultadoAvaliacao';

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
                <Route path='/listagemquestoes' element={<ListagemQuestoes/>}/>
                <Route path='/listagemquestoes/:filtro' element={<ListagemQuestoes/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/criarUsuario' element={<CriarUsuario/>}/>
                <Route path='/ranking' element={<Ranking/>}/>
                <Route path='/historico' element={<HistoricoUsuario/>}/>
                <Route path='/perfil' element={<PerfilUsuario/>}/>
                <Route path='/questoes/:filtro' element={<Questoes/>}/>
                <Route path='/cadastroProva/:filtro' element={<CadastraProva/>}/>
                <Route path='/cadastroProva' element={<CadastraProva/>}/>
                <Route path='/cadastraQuestao/:filtro/:numero' element={<CadastraQuestao/>}/>
                <Route path='/cadastraQuestao/:filtro/:numero/:questaoCode' element={<CadastraQuestao/>}/>
                <Route path='/recoverypass' element={<RecoveryPass/>}/>
                <Route path='/resetpass/:guid' element={<ResetPass/>}/>
                <Route path='/resultadosimulado/:filtro' element={<Resultado/>}/>
                <Route path='/historicosimulado/' element={<HistoricoSimulado/>}/>
                <Route path='/simuladoselecao/' element={<SimuladoSelecao/>}/>
                <Route path='/atualizasenha/' element={<AtualizaSenha/>}/>
                <Route path='/valida/:guid' element={<VerificadorUser/>}/>
                <Route path='/confirmesuaconta/:mail' element={<ConfirmeConta/>}/>
                <Route path='/avaliacoes' element={<ListagemAvaliacoes/>}/>
                <Route path='/avaliacoes/:code' element={<Avaliacao/>}/>
                {
                    localStorage.getItem(Config.ADMIN) === '1' ?
                    <>
                        <Route path='/historicoadmin' element={<HistoricoUsuarioAdmin/>}/>
                        <Route path='/dashboard' element={<DashBoard/>}/>
                        <Route path='/logs' element={<Logs/>}/>
                        <Route path='/usuarios' element={<Usuarios/>}/>
                        <Route path='/historicotabuadadivertida' element={<HistoricoTabuadaDivertida/>}/>
                    </>
                    :
                    localStorage.getItem(Config.ADMIN) === '2' ?
                    <>
                        <Route path='/cadastroavaliacao' element={<CadastroAvaliacao/>}/>
                        <Route path='/cadastroavaliacao/:filtro' element={<CadastroAvaliacao/>}/>
                        <Route path='/listagemminhasavaliacoes' element={<MinhasAvaliacoes/>}/>
                    </>
                    :
                    <>
                    </>
                }
                <Route path='/contato' element={<Contato/>}/>
                <Route path='/notasCorte' element={<NotasCorte/>}/>
                <Route path='/calculadoraEnem' element={<CalculadoraEnem/>}/>
                <Route path='/resultadoAvaliacao/:code' element={<ResultadoAvaliacao/>}/>
                <Route path='*' element={<Erro/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}

export default RoutesApp;