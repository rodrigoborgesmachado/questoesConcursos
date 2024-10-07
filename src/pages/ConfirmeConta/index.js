import "./style.css";
import { useParams } from 'react-router-dom';
import api from '../../services/api.js';
import {toast} from 'react-toastify';
import { useState } from 'react';

function ConfirmeConta(){
    const{mail} = useParams();
    const[quantidadeEnvio, setQuantidadeEnvio] = useState(1);
    const [loadding, setLoadding] = useState(false);

    async function ReenviaEmail(){

        if(quantidadeEnvio > 5){
            toast.warn('Já foi tentado mais de ' + quantidadeEnvio + ' vezes o envio! Entre em contato com o suporte (sunsalesystem@outlook.com)!');
            return;
        }
        
        setLoadding(true);
        setQuantidadeEnvio(quantidadeEnvio+1);

        await api.get('/Usuarios/reenviaEmailConfirmacao?mail=' + mail)
        .then((response) => {
            setLoadding(false);

            if(response.data.success){
                toast.success('Email reenviado!');
            }
            else{
                toast.warn('Não foi possível reenviar o email. Entre em contato com o suporte (sunsalesystem@outlook.com)!');
            }
        })
        .catch(() => {
            setLoadding(false);
            toast.warn('Não foi possível reenviar o email. Entre em contato com o suporte! (sunsalesystem@outlook.com)');
        })
    }
    
    if (loadding) {
        return (
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return(
        <div className="containerpage global-fullW">
            <div className='dados global-infoPanel'>
                <h2 className="center-h2">
                    Usuário criado, você já pode logar!<br/><br/>
                    Você receberá um email para validar sua conta em até 5 minutos, é necessário valida-lo afim de receber emails do questões aqui!<br/><br/>
                    Verifique também sua pasta de span.
                </h2>
                <button className='global-button reenviar-button' onClick={() => ReenviaEmail()}>Reenviar email</button>
            </div>
        </div>
    )
}

export default ConfirmeConta;