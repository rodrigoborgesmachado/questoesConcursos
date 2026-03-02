import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api.js';
import { LimpaFiltrosLocalSession } from '../../services/functions.js';
import iftmLogo from '../../assets/iftm-logo.svg';
import { useAuth } from '../../auth/useAuth';
import { Roles } from '../../auth/roles';
import { requireRole } from '../../auth/requireRole';
import { useTheme } from '../../theme/useTheme';

const menuPaperSx = {
  borderRadius: '12px',
  minWidth: '220px',
  border: '1px solid var(--separator-color-primary)',
  backgroundColor: 'var(--primary-color)',
  color: 'var(--text-color-secondary)',
  boxShadow: 'var(--elevation-shadow)',
};

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDarkTheme } = useTheme();
  const { session, role, isAuthenticated, logout } = useAuth();
  const isAdmin = requireRole(role, [Roles.Admin]);
  const isTeacher = requireRole(role, [Roles.Teacher]);

  const [tipos, setTipos] = React.useState([]);
  const [anchorMobile, setAnchorMobile] = React.useState(null);
  const [anchorProvas, setAnchorProvas] = React.useState(null);
  const [anchorSisu, setAnchorSisu] = React.useState(null);
  const [anchorAdmin, setAnchorAdmin] = React.useState(null);
  const [anchorUser, setAnchorUser] = React.useState(null);

  React.useEffect(() => {
    async function buscaTipos() {
      try {
        const response = await api.get('/TipoProva/getAll');

        if (response.data.success) {
          setTipos(response.data.object);
          return;
        }

        toast.warn('Erro ao buscar tipos de prova');
      } catch {
        toast.warn('Erro ao buscar tipos de prova');
      }
    }

    buscaTipos();
  }, []);

  function closeAllMenus() {
    setAnchorMobile(null);
    setAnchorProvas(null);
    setAnchorSisu(null);
    setAnchorAdmin(null);
    setAnchorUser(null);
  }

  function navigateTo(path) {
    closeAllMenus();
    navigate(path, { replace: true });
  }

  function selecionaFiltroProva(descricao) {
    const isAll = descricao === 'Todas as provas';
    const suffix = isAll ? '' : `&tipos=${encodeURIComponent(descricao)}`;
    navigateTo(`/listagemprovas?page=1${suffix}`);
  }

  function sair() {
    closeAllMenus();
    logout();
    LimpaFiltrosLocalSession();
    toast.success('Volte sempre!');
    navigate('/', { replace: true });
  }

  function renderPrimaryActions(isMobile = false) {
    const itemClass = isMobile ? 'nav-mobile-item' : 'nav-link-btn';

    return (
      <>
        <Button
          onClick={(event) => setAnchorProvas(event.currentTarget)}
          className={itemClass}
          aria-haspopup='menu'
          aria-expanded={Boolean(anchorProvas) ? 'true' : undefined}
          aria-controls='menu-provas'
        >
          📚 Provas
        </Button>
        <Button onClick={() => navigateTo('/simulado')} className={itemClass}>
          🧾 Simulados
        </Button>
        <Button onClick={() => navigateTo('/avaliacoes')} className={itemClass}>
          📒 Avaliações
        </Button>
        <Button onClick={() => navigateTo('/listagemquestoes')} className={itemClass}>
          📔 Questões
        </Button>
        <Button
          onClick={(event) => setAnchorSisu(event.currentTarget)}
          className={itemClass}
          aria-haspopup='menu'
          aria-expanded={Boolean(anchorSisu) ? 'true' : undefined}
          aria-controls='menu-sisu'
        >
          🎓 Sisu
        </Button>
        {isAdmin && (
          <Button
            onClick={(event) => setAnchorAdmin(event.currentTarget)}
            className={itemClass}
            aria-haspopup='menu'
            aria-expanded={Boolean(anchorAdmin) ? 'true' : undefined}
            aria-controls='menu-admin'
          >
            Admin
          </Button>
        )}
      </>
    );
  }

  return (
    <AppBar position='static' className='nav-root'>
      <div className='nav-shell'>
        <div className='nav-left'>
          <IconButton
            className='mobile-menu-button nav-mobile-only'
            onClick={(event) => setAnchorMobile(event.currentTarget)}
            aria-label='Abrir menu principal'
            aria-haspopup='menu'
            aria-expanded={Boolean(anchorMobile) ? 'true' : undefined}
            aria-controls='menu-mobile'
          >
            <MenuIcon />
          </IconButton>
          <Link to='/' className='nav-brand' aria-label='Ir para página inicial'>
            <span className='nav-brand-title'>Questões Aqui</span>
          </Link>
        </div>

        <div className='nav-center nav-desktop-only'>
          <Button
            onClick={() => selecionaFiltroProva('IFTM')}
            className='iftm-nav-button'
            aria-label='Abrir provas do IFTM'
          >
            <span className='iftm-option'>
              <img src={iftmLogo} alt='IFTM' className='iftm-logo' />
              <span className='iftm-label'>IFTM</span>
            </span>
          </Button>
          {renderPrimaryActions(false)}
        </div>

        <div className='nav-right'>
          <Tooltip title={isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro'}>
            <IconButton
              onClick={toggleTheme}
              className='theme-toggle-button'
              aria-label={isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {!isAuthenticated && (
            <Link className='nav-login-link' to='/login' aria-label='Entrar na plataforma'>
              Login
            </Link>
          )}

          {isAuthenticated && (
            <Tooltip title='Abrir opções da conta'>
              <IconButton
                onClick={(event) => setAnchorUser(event.currentTarget)}
                className='avatar-button'
                aria-label='Opções da conta'
                aria-haspopup='menu'
                aria-expanded={Boolean(anchorUser) ? 'true' : undefined}
                aria-controls='menu-user'
              >
                <Avatar alt={session?.name || 'Usuário'} />
              </IconButton>
            </Tooltip>
          )}

        </div>
      </div>

      <Menu
        id='menu-mobile'
        anchorEl={anchorMobile}
        open={Boolean(anchorMobile)}
        onClose={() => setAnchorMobile(null)}
        PaperProps={{ sx: menuPaperSx }}
        className='nav-mobile-only'
      >
        <MenuItem onClick={() => selecionaFiltroProva('IFTM')}>
          <span className='iftm-option'>
            <img src={iftmLogo} alt='IFTM' className='iftm-logo' />
            <span className='iftm-label'>IFTM</span>
          </span>
        </MenuItem>
        <Divider />
        <div className='nav-mobile-actions'>{renderPrimaryActions(true)}</div>
      </Menu>

      <Menu
        id='menu-provas'
        anchorEl={anchorProvas}
        open={Boolean(anchorProvas)}
        onClose={() => setAnchorProvas(null)}
        PaperProps={{ sx: menuPaperSx }}
      >
        <MenuItem onClick={() => selecionaFiltroProva('Todas as provas')}>Todas as provas</MenuItem>
        {tipos.length === 0 && <MenuItem disabled>Carregando tipos...</MenuItem>}
        {tipos.map((tipo) => (
          <MenuItem key={tipo.codigo} onClick={() => selecionaFiltroProva(tipo.descricao)}>
            {tipo.descricao}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        id='menu-sisu'
        anchorEl={anchorSisu}
        open={Boolean(anchorSisu)}
        onClose={() => setAnchorSisu(null)}
        PaperProps={{ sx: menuPaperSx }}
      >
        <MenuItem onClick={() => navigateTo('/notasCorte')}>Notas de corte</MenuItem>
        <MenuItem onClick={() => navigateTo('/calculadoraEnem')}>Calculadora Enem</MenuItem>
      </Menu>

      <Menu
        id='menu-admin'
        anchorEl={anchorAdmin}
        open={Boolean(anchorAdmin)}
        onClose={() => setAnchorAdmin(null)}
        PaperProps={{ sx: menuPaperSx }}
      >
        <MenuItem onClick={() => navigateTo('/dashboard')}>Dashboard</MenuItem>
        <MenuItem onClick={() => navigateTo('/logs')}>Logs</MenuItem>
        <MenuItem onClick={() => navigateTo('/usuarios')}>Usuários</MenuItem>
        <MenuItem onClick={() => navigateTo('/historicoadmin')}>Histórico de usuários</MenuItem>
        <MenuItem onClick={() => navigateTo('/historicotabuadadivertida')}>Histórico Tabuada Divertida</MenuItem>
        <MenuItem onClick={() => navigateTo('/historicorespostas')}>Histórico Respostas</MenuItem>
      </Menu>

      <Menu
        id='menu-user'
        anchorEl={anchorUser}
        open={Boolean(anchorUser)}
        onClose={() => setAnchorUser(null)}
        PaperProps={{ sx: menuPaperSx }}
      >
        <MenuItem disabled>
          <Typography variant='body2'>Olá, {session?.name || 'Usuário'}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigateTo('/perfil')}>Perfil 👽</MenuItem>
        <MenuItem onClick={() => navigateTo('/meudesempenho')}>Meu Desempenho 📊</MenuItem>
        <MenuItem onClick={() => navigateTo('/historico')}>Histórico de Questões ⏳</MenuItem>
        <MenuItem onClick={() => navigateTo('/historicosimulado')}>Histórico Simulados 🧾</MenuItem>
        <MenuItem onClick={() => navigateTo('/ranking')}>Ranking dos usuários 🔝</MenuItem>
        {isTeacher && (
          <Box>
            <Divider />
            <MenuItem onClick={() => navigateTo('/cadastroavaliacao?previus=')}>Cadastrar Avaliação</MenuItem>
            <MenuItem onClick={() => navigateTo('/listagemminhasavaliacoes')}>Minhas Avaliações</MenuItem>
          </Box>
        )}
        <Divider />
        <MenuItem onClick={sair}>Sair 👋</MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Navbar;
