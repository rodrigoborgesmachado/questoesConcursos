import './style.css';
import { useEffect, useState } from 'react';
import Config from '../../config.json';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import api from '../../services/api.js';
import Modal from 'react-modal';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";

const customStyles = {
    content: {
      top: '30%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      border: 0,
      background: '#424242',
      marginRight: '-50%',
      'border-radius': '5px',
      transform: 'translate(-50%, -50%)',
      width: '50%'
    },
  };

function CadastraProva(){
    const navigate = useNavigate();

    const{filtro} = useParams();
    const animatedComponents = makeAnimated();
    const[nome, setNome] = useState('');
    const[local, setLocal] = useState('');
    const[tipo, setTipo] = useState('');
    const[dataAplicacao, setDataAplicacao] = useState('');
    const[banca, setBanca] = useState('');
    const[linkProva, setLinkProva] = useState('');
    const[linkGabarito, setLinkGabarito] = useState('');
    const[observacaoProva, setObservacaoProva] = useState('');
    const[observacaoGabarito, setObservacaoGabarito] = useState('');
    const[tipos, setTipos] = useState([]);
    const[tiposSelecionados, setTiposSelecionados] = useState([]);
    const[loadding, setLoadding] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [novoTipo, setNovoTipo] = useState('');
    const [selected, setSelected ] = useState([]);

    function openModal() {
        setIsOpen(true);
    }
    
    function closeModal() {
        setIsOpen(false);
    }

    async function buscaTipos(){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        await api.get('/TipoProva/pagged?page=1&quantity=10000')
        .then((response) => {
            if(response.data.success){
                var t = [];
                response.data.object.forEach(element => {
                    t.push({
                        value: element.codigo,
                        label: element.descricao
                    })
                });
                setTipos(t);
                setLoadding(false);
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar tipos');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar tipos');
        })
    }

    async function buscaProva(codigo){
        if(!localStorage.getItem(Config.TOKEN)){
            toast.info('Necessário logar para acessar!');
            navigate('/', {replace: true});
            return;
        }

        await api.get('/Prova/getById?id=' + codigo)
        .then((response) => {
            if(response.data.success){
                setNome(response.data.object.nomeProva);
                setLocal(response.data.object.local);
                setTipo(response.data.object.tipoProva);
                setDataAplicacao(response.data.object.dataAplicacao);
                setBanca(response.data.object.banca);
                setLinkProva(response.data.object.linkProva);
                setLinkGabarito(response.data.object.linkGabarito);
                setObservacaoProva(response.data.object.observacaoProva);
                setObservacaoGabarito(response.data.object.observacaoGabarito);

                var t = [];
                response.data.object.tipoProvaAssociado.forEach(element => {
                    t.push({
                        value: element.codigoTipo,
                        label: element.tipoProva.descricao
                    })
                });

                setSelected(t);

                console.log(t);
                setLoadding(false);
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar tipos');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar tipos');
        })
    }

    useEffect(() => {
        setLoadding(true);
        buscaTipos();

        if(filtro != undefined){
            buscaProva(filtro);
        }
    }, []);


    async function confirmaFormulario(){
        setLoadding(true);
        
        if(filtro == undefined){
            await Cadastra();
        }
        else{
            await Atualiza(filtro);
        }
    }

    async function Cadastra(){
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
            banca: banca,
            TipoProvaAssociado: tiposSelecionados
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

    async function Atualiza(codigo){
        await api.put(`/Prova`, 
        {
            id:codigo,
            nomeProva: nome,
            local: local,
            tipoProva: tipo,
            dataAplicacao: dataAplicacao,
            linkProva: linkProva,
            linkGabarito: linkGabarito,
            observacaoProva: observacaoProva,
            observacaoGabarito: observacaoGabarito,
            banca: banca,
            TipoProvaAssociado: tiposSelecionados
        }
        )
        .then((response) => {
            if(response.data.success){
                toast.success('Prova atualizada com sucesso!');
                navigate('/listagemprovas/1', {replace: true});
            }
            else{
                toast.info('Erro ao atualizar!');
                toast.warn(response.data.message);
            }
            setLoadding(false);
        }).catch(() => {
            setLoadding(false);
            toast.error('Erro ao atualizar a prova!');
            return;
        });
    }

    const handleChange = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                codigoTipo:item.value,
                codigoProva: filtro === undefined ? 0 : filtro
            }
            );
        })

        setSelected(selectedOptions);
        setTiposSelecionados(temp);
    }

    async function adicionarTipo(){
        if(novoTipo == ''){
            toast.warn('Deve ser preenchido um novo tipo!');
            return;
        }
        setLoadding(true);

        await api.post('/TipoProva', {
            descricao: novoTipo
        }).then((response) => {
            setLoadding(false);
            closeModal();
            setNovoTipo('');
            if(response.data.success){
                toast.success('Tipo cadastrado!');
                setTiposSelecionados([]);
                setLoadding(true);
                buscaTipos();
            }
            else{
                toast.info('Erro ao cadastrar tipo!');
                toast.warn(response.data.message);
            }
        }).catch(() => {
            closeModal();
            setLoadding(false);
            toast.error('Erro ao criar a tipo!');
            return;
        });
    }

    function voltarListagemProva(){
        var page = localStorage.getItem(Config.PaginaListagem) == null ? '1' : localStorage.getItem(Config.PaginaListagem);
        navigate('/listagemprovas/' + page, {replace: true});
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
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Cadastro de tipo</h3>
                    </div>
                    <div className='filtrosProva'>
                        <h4>
                            Novo tipo:
                        </h4>
                        <input type='text' value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)}/>
                    </div>
                    <div className='botoesModalFiltro'>
                        <button onClick={adicionarTipo}>Adicionar</button>
                    </div>
                </div>
            </Modal>
            <div className='total'>
                <h2 onClick={voltarListagemProva}><BsFillArrowLeftCircleFill size={40}/></h2>
            </div>
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
                <h3>
                    Tipos:
                </h3>
                <div className="tiposProva">
                    <Select closeMenuOnSelect={false} components={animatedComponents} options={tipos} value={selected} isMulti onChange={handleChange} />
                    <button onClick={() => openModal()}>➕</button>
                </div>
                <button onClick={confirmaFormulario}>Confirma</button>
            </div>
        </div>
    )
}

export default CadastraProva;