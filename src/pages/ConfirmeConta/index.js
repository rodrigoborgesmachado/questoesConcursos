import { useParams } from 'react-router-dom';
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import { useState } from 'react';

function ConfirmeConta(){
    const{mail} = useParams();
    const[quantidadeEnvio, setQuantidadeEnvio] = useState(1);

    async function ReenviaEmail(){

        if(quantidadeEnvio > 5){
            toast.warn('Já foi tentado mais de ' + quantidadeEnvio + ' vezes o envio! Entre em contato com o suporte (sunsalesystem@outlook.com)!');
            return;
        }
        
        setQuantidadeEnvio(quantidadeEnvio+1);

        await api.get('/Usuarios/reenviaEmailConfirmacao?mail=' + mail)
        .then((response) => {
            if(response.data.success){
                toast.success('Email reenviado!');
            }
            else{
                toast.warn('Não foi possível reenviar o email. Entre em contato com o suporte (sunsalesystem@outlook.com)!');
            }
        })
        .catch(() => {
            toast.warn('Não foi possível reenviar o email. Entre em contato com o suporte! (sunsalesystem@outlook.com)');
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