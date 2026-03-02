import './style.css';
import LanguageIcon from '@mui/icons-material/Language';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

function Contato(){
    return (
        <div className="containerpage global-fullW">
            <div className="dados global-infoPanel">
                <div className="info-contato">
                    <p>
                        <a target='_blank' rel='noreferrer' href='http://www.sunsalesystem.com.br/' ><LanguageIcon/> SunSale System</a>
                    </p>
                    <p>
                        <a href="https://wa.me/5534999798100" target="_blank" rel='noreferrer'><WhatsAppIcon/> Rodrigo Machado</a>
                    </p>
                    <p>
                        <EmailIcon/> rodrigomachado@sunsalesystem.com
                    </p>
                    <p>
                        <a href="https://www.linkedin.com/company/sunsale-system/" target="_blank" rel='noreferrer'><LinkedInIcon/> LinkedIn</a>
                    </p>
                    <p>
                        <a href="https://github.com/rodrigoborgesmachado" target="_blank" rel='noreferrer'><GitHubIcon/> GitHub</a>
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Contato;
