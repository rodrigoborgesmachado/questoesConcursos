import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import './style.css';
import Config from './../../config.json';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api.js';
import { LimpaFiltrosLocalSession } from '../../services/functions.js';

const pages = ['📚 Provas', '🧾 Simulados', '📒Avaliações', '📔Questões', '🎓 Sisu', '➕Pratique Tabuada'];
if(localStorage.getItem(Config.ADMIN) === '1'){
  pages.push('Admin');
}

const settings = ['Olá ' + localStorage.getItem(Config.Nome)];
settings.push('Perfil👽');
settings.push('Meu Desempenho📊');

if(localStorage.getItem(Config.ADMIN) === '2'){
  settings.push('Minhas Avaliações');
}

settings.push('Histórico de Questões⏳');
settings.push('Histórico Simulados🧾');
settings.push('Ranking dos usuários🔝');
settings.push('Sair👋');

const ResponsiveAppBar = () => {
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElProva, setAnchorElProva] = React.useState(null);
    const [anchorElSisu, setAnchorElSisu] = React.useState(null);
    const [anchorElAdmin, setAnchorElAdmin] = React.useState(null);
    const [anchorElMinhasAvaliacoes, setAnchorElMinhasAvaliacoes] = React.useState(null);
    const [tipos, setTipos] = React.useState([]);

  async function buscaTipos(){
    await api.get('/TipoProva/getAll')
    .then((response) => {
        if(response.data.success){
            setTipos(response.data.object);
        }
        else{
            toast.warn('Erro ao buscar tipos');    
        }
    })
    .catch(() => {
        toast.warn('Erro ao buscar tipos');
    })
  }

  React.useEffect(() => {
    buscaTipos();
  }, [])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenProvaMenu = (event) => {
    setAnchorElProva(event.currentTarget);
  };

  const handleCloseProvaMenu = () => {
    setAnchorElProva(null);
  };

  const handleOpenSisuMenu = (event) => {
    setAnchorElSisu(event.currentTarget);
  };

  const handleCloseSisuMenu = () => {
    setAnchorElSisu(null);
  };

  const handleOpenAdminMenu = (event) => {
    setAnchorElAdmin(event.currentTarget);
  };

  const handleCloseAdminMenu = () => {
    setAnchorElAdmin(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenMinhasAvaliacoes = (event) => {
    setAnchorElMinhasAvaliacoes(event.currentTarget);
  };

  const handleCloseMinhasAvaliacoes = () => {
    setAnchorElMinhasAvaliacoes(null);
    setAnchorElUser(null);
  };

  function SelecionaOpcao(page){
    handleCloseNavMenu();
    if(page === pages[1]){
      navigate('/simulado', {replace: true});
    }
    else if(page === pages[2]){
      navigate('/avaliacoes', {replace: true});
    }
    else if(page === pages[3]){
      navigate('/listagemquestoes', {replace: true});
    }
    else if(page === pages[5]){
      window.open("https://www.tabuadadivertida.com/", "_blank");
    }
  }

  function SelecionaOpcaoUsuario(setting){
    if(setting !== 'Minhas Avaliações'){
      handleCloseUserMenu();
    }
    
    if(setting === 'Perfil👽'){
      navigate('/perfil', {replace: true});
    }
    else if(setting === "Meu Desempenho📊"){
      navigate('/meudesempenho', {replace: true});
    }
    else if(setting === 'Histórico de Questões⏳'){
        navigate('/historico', {replace: true});
    }
    else if(setting === 'Histórico Simulados🧾'){
      navigate('/historicosimulado', {replace: true});
    }
    else if(setting === 'Ranking dos usuários🔝'){
        navigate('/ranking', {replace: true});
    }
    else if(setting === 'Sair👋'){
        sair();
    }
  }

  function selecionaFiltroProva(descricao){
    handleCloseProvaMenu();
    handleCloseNavMenu();

    if(descricao != 'Todas as provas'){
      var list = [];
      list.push({
        value: descricao,
        label: descricao
      });
  
      localStorage.setItem(Config.filtroTiposSelecionados, JSON.stringify(list));
    }
    else{
      localStorage.setItem(Config.filtroTiposSelecionados, JSON.stringify([]));
      localStorage.setItem(Config.filtroProfessoresSelecionadas, JSON.stringify([]));
      localStorage.setItem(Config.filtroAssuntosSelecionadas, JSON.stringify([]));
      localStorage.setItem(Config.filtroMateriasSelecionadas, JSON.stringify([]));
      localStorage.setItem(Config.filtroProvasSelecionadas, JSON.stringify([]));
      localStorage.setItem(Config.filtroBancasSelecionadas, JSON.stringify([]));
    }
    
    window.location.href = '/listagemprovas/1';
  }

  function sair(){
    localStorage.setItem(Config.LOGADO, 0);
    localStorage.setItem(Config.USUARIO, '');
    localStorage.setItem(Config.TOKEN, '');
    localStorage.setItem(Config.ADMIN, '');
    localStorage.setItem(Config.TEMPO_PARAM, 0);
    localStorage.removeItem(Config.LOGADO);
    localStorage.removeItem(Config.USUARIO);
    localStorage.removeItem(Config.TOKEN);
    localStorage.removeItem(Config.ADMIN);

    LimpaFiltrosLocalSession();
    
    toast.success('Volte sempre!');
    navigate('/', {replace: true});
    window.location.href = '/';
  }

  function abreTelaNotaDeCorte(){
    handleCloseSisuMenu();
    handleCloseNavMenu();
    navigate('/notasCorte', {replace: true});
  }

  function abreTelaCalculadoraEnem(){
    handleCloseSisuMenu();
    handleCloseNavMenu();
    navigate('/calculadoraEnem', {replace: true});
  }

  function abreTelaListagemHistoricoUsuario(){
    handleCloseAdminMenu();
    handleCloseNavMenu();
    navigate('/historicoadmin', {replace: true});
  }

  function abreTelaDashboard(){
    handleCloseAdminMenu();
    handleCloseNavMenu();
    navigate('/dashboard', {replace: true});
  }

  function abreTelaLogs(){
    handleCloseAdminMenu();
    handleCloseNavMenu();
    navigate('/logs', {replace: true});
  }

  function abreTelaUsuarios(){
    handleCloseAdminMenu();
    handleCloseNavMenu();
    navigate('/usuarios', {replace: true});
  }

  function abreTelaHistoricoTabuadaDivertida(){
    handleCloseAdminMenu();
    handleCloseNavMenu();
    navigate('/historicotabuadadivertida', {replace: true});
  }

  function abreTelaHistoricoRespostas(){
    handleCloseAdminMenu();
    handleCloseNavMenu();
    navigate('/historicorespostas', {replace: true});
  }

  function abreTelaCadastroAvaliacao(){
    handleCloseMinhasAvaliacoes();
    handleCloseUserMenu();
    navigate('/cadastroavaliacao?previus=', {replace: true});
  }

  function abreTelaMinhasAvaliacoes(){
    handleCloseMinhasAvaliacoes();
    handleCloseUserMenu();
    navigate('/listagemminhasavaliacoes', {replace: true});
  }

  return (
    <AppBar position="static" className='varBarResponsive'>
      <div className='conNav'>
        <div disableGutters className='toolNav'>
          <BatteryChargingFullIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <a href='/'>ConQuest</a>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, index) => (
                index != 0 && index != 4 && index != 6 ?
                <MenuItem key={index} onClick={(e) => SelecionaOpcao(page)}>
                  <Typography textAlign="center">
                    {page}
                  </Typography>
                </MenuItem>
                :
                index == 0?
                <>
                  <MenuItem key={index} onClick={handleOpenProvaMenu} >
                    <Typography textAlign="center">
                      {page}
                    </Typography>
                  </MenuItem>
                  <Menu
                    sx={{ ml: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElProva}
                    keepMounted
                    open={Boolean(anchorElProva)}
                    onClose={handleCloseProvaMenu}
                  >
                    {
                      tipos == 0 ? 
                      <MenuItem>
                        <Typography textAlign="center">
                            Carregando
                          </Typography>
                      </MenuItem>
                      :
                      <>
                      {tipos.map((tipos) => (
                        <MenuItem key={tipos.codigo} onClick={(e) => selecionaFiltroProva(tipos.descricao)}>
                          <Typography textAlign="center">
                              {tipos.descricao}
                            </Typography>
                        </MenuItem>
                      ))}
                      </>
                    }
                  </Menu>
                </>
                :
                index == 4?
                <>
                  <MenuItem key={page} onClick={handleOpenSisuMenu} >
                    <Typography textAlign="center">
                      {page}
                    </Typography>
                  </MenuItem>
                  <Menu
                    sx={{ ml: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElSisu}
                    keepMounted
                    open={Boolean(anchorElSisu)}
                    onClose={handleCloseSisuMenu}
                  >
                    <MenuItem onClick={(e) => abreTelaNotaDeCorte()}>
                      <Typography textAlign="center">
                          Notas de corte
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={(e) => abreTelaCalculadoraEnem()}>
                      <Typography textAlign="center">
                          Calculadora Enem
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
                :
                <>
                  <MenuItem key={page} onClick={handleOpenAdminMenu} >
                    <Typography textAlign="center">
                      {page}
                    </Typography>
                  </MenuItem>
                  <Menu
                    sx={{ ml: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElAdmin}
                    keepMounted
                    open={Boolean(anchorElAdmin)}
                    onClose={handleCloseAdminMenu}
                  >
                    <MenuItem onClick={(e) => abreTelaDashboard()}>
                      <Typography textAlign="center">
                          DashBoard
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={(e) => abreTelaLogs()}>
                      <Typography textAlign="center">
                          Logs
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={(e) => abreTelaUsuarios()}>
                      <Typography textAlign="center">
                          Usuarios
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={(e) => abreTelaListagemHistoricoUsuario()}>
                      <Typography textAlign="center">
                          Histórico de usuários
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={(e) => abreTelaHistoricoTabuadaDivertida()}>
                      <Typography textAlign="center">
                          Histórico Tabuada Divertida
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={(e) => abreTelaHistoricoRespostas()}>
                      <Typography textAlign="center">
                          Histórico Respostas
                      </Typography>
                    </MenuItem>
                  </Menu>
                </>
              ))}
            </Menu>
          </Box>
          <BatteryChargingFullIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <a href='/'>ConQuest</a>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              index != 0 && index != 4 && index != 6 ?
              <Button
                key={index}
                onClick={(e) => SelecionaOpcao(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
              : index == 0 ?
              <> 
                <Button key={index} onClick={handleOpenProvaMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                    {page}
                </Button>
                <Menu
                  sx={{ ml: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElProva}
                  keepMounted
                  open={Boolean(anchorElProva)}
                  onClose={handleCloseProvaMenu}
                >
                  {
                    tipos.length == 0 ? 
                    <MenuItem>
                      <Typography textAlign="center">
                          Carregando
                        </Typography>
                    </MenuItem>
                    :
                    <>
                    {tipos.map((tipos) => (
                      <MenuItem key={tipos.codigo} onClick={(e) => selecionaFiltroProva(tipos.descricao)}>
                        <Typography textAlign="center">
                            {tipos.descricao}
                          </Typography>
                      </MenuItem>
                    ))}
                    </>
                  }
                </Menu>
              </>
              :
              index == 4 ?
              <> 
                <Button key={index} onClick={handleOpenSisuMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                    {page}
                </Button>
                <Menu
                  sx={{ ml: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElSisu}
                  keepMounted
                  open={Boolean(anchorElSisu)}
                  onClose={handleCloseSisuMenu}
                >
                  <MenuItem onClick={(e) => abreTelaNotaDeCorte()}>
                    <Typography textAlign="center">
                        Notas de corte
                      </Typography>
                  </MenuItem>
                  <MenuItem onClick={(e) => abreTelaCalculadoraEnem()}>
                      <Typography textAlign="center">
                          Calculadora Enem
                      </Typography>
                    </MenuItem>
                </Menu>
              </>
              :
              <> 
                <Button key={index} onClick={handleOpenAdminMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                    {page}
                </Button>
                <Menu
                  sx={{ ml: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElAdmin}
                  keepMounted
                  open={Boolean(anchorElAdmin)}
                  onClose={handleCloseAdminMenu}
                >
                  <MenuItem onClick={(e) => abreTelaDashboard()}>
                    <Typography textAlign="center">
                        DashBoard
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={(e) => abreTelaLogs()}>
                    <Typography textAlign="center">
                        Logs
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={(e) => abreTelaUsuarios()}>
                    <Typography textAlign="center">
                        Usuarios
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={(e) => abreTelaListagemHistoricoUsuario()}>
                    <Typography textAlign="center">
                        Histórico de usuários
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={(e) => abreTelaHistoricoTabuadaDivertida()}>
                    <Typography textAlign="center">
                        Histórico Tabuada Divertida
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={(e) => abreTelaHistoricoRespostas()}>
                      <Typography textAlign="center">
                          Histórico Respostas
                      </Typography>
                    </MenuItem>
                </Menu>
              </>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {
                localStorage.getItem(Config.LOGADO) == null || localStorage.getItem(Config.LOGADO) === '0'?
                <>
                <h3>
                <Link className='logo' to='/login'><span>Login</span></Link>
                </h3>
                </>
                :
                <>
                <Tooltip title="Opções">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp"/>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting, index) => (
                    <MenuItem key={setting} onClick={(e) => SelecionaOpcaoUsuario(setting)}>
                    {
                      index == 3  && localStorage.getItem(Config.ADMIN) === '2'?
                      <>
                        <Typography key={setting} onClick={handleOpenMinhasAvaliacoes}>
                            {setting}
                        </Typography>
                        <Menu
                          sx={{ ml: '45px' }}
                          id="menu-appbar"
                          anchorEl={anchorElMinhasAvaliacoes}
                          keepMounted
                          open={Boolean(anchorElMinhasAvaliacoes)}
                          onClose={handleCloseMinhasAvaliacoes}
                        >
                          <MenuItem onClick={(e) => abreTelaCadastroAvaliacao()}>
                            <Typography textAlign="center">
                                Cadastrar
                            </Typography>
                          </MenuItem>
                          <MenuItem onClick={(e) => abreTelaMinhasAvaliacoes()}>
                            <Typography textAlign="center">
                                Listar Avaliações
                            </Typography>
                          </MenuItem>
                        </Menu>
                      </>
                      :
                        <Typography textAlign="center">
                          {setting}
                        </Typography>
                      
                      
                    }
                    </MenuItem>
                  ))}
                </Menu>
                </>
            }
            
          </Box>
        </div>
      </div>
    </AppBar>
  );
};
export default ResponsiveAppBar;