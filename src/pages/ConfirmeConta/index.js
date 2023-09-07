import { useParams } from 'react-router-dom';
import api from '../../services/api.js';
import {toast} from 'react-toastify';

function ConfirmeConta(){
    const{mail} = useParams();

    async function ReenviaEmail(){
        await api.get('/Usuarios/reenviaEmailConfirmacao?mail=' + mail)
        .then((response) => {
            if(response.data.success){
                toast.success('Email reenviado!');
            }
            else{
                toast.warn('Não foi possível reenviar o email. Entre em contato com o suporte!');
            }
        })
        .catch(() => {
            toast.warn('Não foi possível reenviar o email. Entre em contato com o suporte!');
        })
    }

    return(
        <div className="containerpage global-fullW">
            <div className='dados global-infoPanel'>
                <p>
                    Você receberá um email para validar sua conta em até 5 minutos.
                </p>
                <button className='global-button' onClick={() => ReenviaEmail()}>Reenviar email</button>
            </div>
        </div>
    )
}

export default ConfirmeConta;