import './style.css';
import { useState } from 'react';
import Config from '../../config.json';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';

function CadastraProva(){
    const navigate = useNavigate();

    const[nome, setNome] = useState('');
    const[local, setLocal] = useState('');
    const[tipo, setTipo] = useState('');
    const[dataAplicacao, setDataAplicacao] = useState('');
    const[banca, setBanca] = useState('');
    const[linkProva, setLinkProva] = useState('');
    const[linkGabarito, setLinkGabarito] = useState('');
    const[observacaoProva, setObservacaoProva] = useState('');
    const[observacaoGabarito, setObservacaoGabarito] = useState('');
    const[loadding, setLoadding] = useState(false);

    async function confirmaFormulario(){
        setLoadding(true);
        await api.post(`/Prova`, 
        {
            nomeProva: nome,
            local: local,
            tipoProva: tipo,
            dataAplicacao: dataAplicacao,
            linkProva: linkProva,
            linkGabarito: linkGabarito,
            observacaoProva: observacaoProva,
            observacaoGabarito: observacaoGabarito,
            banca: banca
        }
        )
        .then((response) => {
            if(response.data.success){
                toast.success('Prova cadastrada com sucesso!');
                navigate('/listagemprovas/1', {replace: true});
            }
            else{
                toast.info('Erro ao cadastrar!');
                toast.warn(response.data.message);
            }
            setLoadding(false);
        }).catch(() => {
            setLoadding(false);
            toast.error('Erro ao criar a prova!');
            return;
        });
    }

    if(localStorage.getItem(Config.LOGADO) == null || localStorage.getItem(Config.LOGADO) === '0' ){
        navigate('/login', {replace: true});
    }

    if(localStorage.getItem(Config.ADMIN) != '1'){
        navigate('/', {replace: true});
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <img src={require('../../assets/hug.gif')} alt="Loading..." />
            </div>
        )
    }

    return(
        <div className="containerpage">
            <h2>
                Cadastro de Prova
            </h2>
            <div className='criarUsuario'>
                <h3>
                    Nome
                </h3>
                <input type='text' value={nome} onChange={(e) => setNome(e.target.value)}></input>
                <h3>
                    Local
                </h3>
                <input type='text' value={local} name='local' id='local' onChange={(e) => setLocal(e.target.value)}></input>
                <h3>
                    Tipo da prova
                </h3>
                <input type='text' value={tipo} name='tipo' id='tipo' onChange={(e) => setTipo(e.target.value)}></input>
                <h3>
                    Data da aplicação
                </h3>
                <input type='text' value={dataAplicacao} name='dataAplicacao' id='dataAplicacao' onChange={(e) => setDataAplicacao(e.target.value)}></input>
                <h3>
                    Banca
                </h3>
                <input type='text' value={banca} name='banca' id='banca' onChange={(e) => setBanca(e.target.value)}></input>
                <h3>
                    Link para download da prova
                </h3>
                <input type='text' value={linkProva} name='linkProva' id='linkProva' onChange={(e) => setLinkProva(e.target.value)}></input>
                <h3>
                    Link para download do gabarito
                </h3>
                <input type='text' value={linkGabarito} name='linkGabarito' id='linkGabarito' onChange={(e) => setLinkGabarito(e.target.value)}></input>
                <h3>
                    Observação sobre a prova
                </h3>
                <input type='text' value={observacaoProva} name='observacaoProva' id='observacaoProva' onChange={(e) => setObservacaoProva(e.target.value)}></input>
                <h3>
                    Observação sobre o gabarito
                </h3>
                <input type='text' value={observacaoGabarito} name='observacaoGabarito' id='observacaoGabarito' onChange={(e) => setObservacaoGabarito(e.target.value)}></input>
                <button onClick={confirmaFormulario}>Confirma</button>
            </div>
        </div>
    )
}

export default CadastraProva;