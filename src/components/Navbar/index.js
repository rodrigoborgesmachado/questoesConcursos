import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
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

const pages = ['Provas📚', 'Simulados🧾', 'Bancas🏛️', 'Matérias🏭', 'Pratique Tabuada➕'];
if(localStorage.getItem(Config.ADMIN) === '1'){
  pages.push('Admin');
}
const settings = ['Olá ' + localStorage.getItem(Config.Nome), 'Perfil👽', 'Histórico de Questões⏳', 'Histórico Simulados🧾', 'Ranking dos usuários🔝','Sair👋'];

const ResponsiveAppBar = () => {
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [anchorElProva, setAnchorElProva] = React.useState(null);
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

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function SelecionaOpcao(page){
    handleCloseNavMenu();
    if(page === pages[0]){
      navigate('/listagemprovas/1', {replace: true});
    }
    else if(page === pages[1]){
      navigate('/simulado', {replace: true});
    }
    else if(page === pages[2]){
      navigate('/bancas', {replace: true});
    }
    else if(page === pages[3]){
      navigate('/materias', {replace: true});
    }
    else if(page === pages[4]){
      window.open("https://www.tabuadadivertida.com/", "_blank");
    }
    else if(page === pages[5]){
      navigate('/admin', {replace: true});
    }
  }

  function SelecionaOpcaoUsuario(setting){
    handleCloseUserMenu();
    
    if(setting === settings[1]){
      navigate('/perfil', {replace: true});
    }
    else if(setting === settings[2]){
        navigate('/historico', {replace: true});
    }
    else if(setting === settings[3]){
      navigate('/historicosimulado', {replace: true});
    }
    else if(setting === settings[4]){
        navigate('/ranking', {replace: true});
    }
    else if(setting === settings[5]){
        sair();
    }
  }

  function selecionaFiltroProva(descricao){
    handleCloseProvaMenu();
    handleCloseNavMenu();

    localStorage.setItem(Config.FiltroProva, descricao);
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
    
    toast.success('Volte sempre!');
    navigate('/', {replace: true});
    window.location.href = '/';
  }

  return (
    <AppBar position="static" className='varBarResponsive'>
      <Container maxWidth="xl" className='conNav'>
        <Toolbar disableGutters className='toolNav'>
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
              {pages.map((page) => (
                page != 'Provas📚' ?
                <MenuItem key={page} onClick={(e) => SelecionaOpcao(page)}>
                  <Typography textAlign="center">
                    {page}
                  </Typography>
                </MenuItem>
                :
                <>
                  <MenuItem key={page} onClick={handleOpenProvaMenu} >
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
            {pages.map((page) => (
              page != 'Provas📚' ?
              <Button
                key={page}
                onClick={(e) => SelecionaOpcao(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
              :
              <>
                <Button key={page} onClick={handleOpenProvaMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
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
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={(e) => SelecionaOpcaoUsuario(setting)}>
                      <Typography textAlign="center">
                          {setting}
                        </Typography>
                    </MenuItem>
                  ))}
                </Menu>
                </>
            }
            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;