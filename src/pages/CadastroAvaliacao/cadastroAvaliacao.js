import './cadastroAvaliacao.css';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import api from '../../services/api.js';
import Modal from 'react-modal';
import { ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Table } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';

const customStylesQuestoes = {
content: {
    top: '45%',
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

const filtroBanca=1;
const filtroProva=2;
const filtroMateria=3;

function CadastroAvaliacao(){
    const navigate = useNavigate();
    const{filtro} = useParams();
    const animatedComponents = makeAnimated();
    const [loadding, setLoadding] = useState(false);

    const[classPublic, setClassPublic] = useState('toggleButtonClicked');
    const[nome, setNome] = useState('');
    const[orientacao, setOrientacao] = useState('');
    const[isPublic, setIsPublic] = useState(true);
    const[questoesAvaliacao, setQuestoesAvaliacao] = useState([]);
    const[pageQuestoesAvaliacao, setPageQuestoesAvaliacao] = useState(1);
    const[questoes, setQuestoes] = useState([]);
    const[quantityQuestoes, setQuantityQuestoes] = useState(1);
    const[pageQuestoes, setPageQuestoes] = useState(1);
    const[quantityPerPage] = useState(5);
    const[provas, setProvas] = useState([]);
    const[selectedProvas, setSelectedProvas ] = useState([]);
    const[materias, setMaterias] = useState([]);
    const[selectedMaterias, setSelectedMaterias ] = useState([]);
    const[bancas, setBancas] = useState([]);
    const[selectedBancas, setSelectedBancas ] = useState([]);
    const[filtrando, setFiltrando ] = useState(true);
    const[acao, setAcao ] = useState('I');

    const [modalQuestoesAvaliacao, setModalQuestoesAvaliacao] = useState(false);
    const [modalQuestoes, setModalQuestoes] = useState(false);

    async function BuscaAvaliacao(){
        setLoadding(true);

        await api.get('/Avaliacao/getById?id=' + filtro)
        .then((response) => {
            if(response.data.success){
                setNome(response.data.object.nome);
                setOrientacao(response.data.object.orientacao);
                setIsPublic(response.data.object.isPublic == "1");

                var t = [];

                response.data.object.questoesAvaliacao.forEach(q => t.push(q.questao));

                setQuestoesAvaliacao(t);
                setLoadding(false);
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar filtros');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar filtros');
        })
    }

    useEffect(() => {
        if(filtro){
            setAcao('E');
            BuscaAvaliacao();
        }
        else{
            setAcao('I');
        }
    }, []);

    useEffect(() => {
        buscaDadosFiltro(filtroBanca);
        buscaDadosFiltro(filtroMateria);
    }, [selectedProvas]);

    useEffect(() => {
        buscaDadosFiltro(filtroProva);
        buscaDadosFiltro(filtroMateria);
    }, [selectedBancas]);

    useEffect(() => {
        buscaDadosFiltro(filtroBanca);
        buscaDadosFiltro(filtroProva);
    }, [selectedMaterias]);

    function openModalQuestoesAvaliacao() {
        setPageQuestoesAvaliacao(1);
        setModalQuestoesAvaliacao(true);
    }

    function closeModalQuestoesAvaliacao() {
        setModalQuestoesAvaliacao(false);
    }

    async function openModalQuestoes() {
        setLoadding(true);

        await buscaDadosFiltro(filtroBanca);
        await buscaDadosFiltro(filtroProva);
        await buscaDadosFiltro(filtroMateria);

        setLoadding(false);

        setModalQuestoes(true);
    }

    function closeModalQuestoes() {
        setModalQuestoes(false);
    }

    function setColor(value){
        setClassPublic(value ? 'toggleButtonClicked' : 'toggleButton');
    }

    function abreQuestao(codigoQuestao){
        const url = window.location.protocol + '/questoes/codigoquestaolistagem:' + codigoQuestao;
        // Open a new tab with the specified URL
        window.open(url, '_blank');
    }

    const handleChange = (event, value) => {
        setPageQuestoesAvaliacao(value);
    };

    const handleChangeQuestoes = (event, value) => {
        setPageQuestoes(value);
        buscaQuestoes(value);
    };

    const handleChangeSelectProva = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                codigoProva: item.value
            }
            );
        })

        setSelectedProvas(selectedOptions);
    }

    const handleChangeSelectMateria = (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                materia: item.value
            }
            );
        })

        setSelectedMaterias(selectedOptions);
    }

    const handleChangeSelectBanca = async (selectedOptions, event) => {
        let temp = [];
        selectedOptions.forEach((item) => {
            temp.push({
                banca: item.value
            }
            );
        })

        setSelectedBancas(selectedOptions);
    }

    function montaBusca(){
        var retorno = '';

        if(selectedProvas.length > 0){
            retorno += "&provas="
            selectedProvas.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        if(selectedMaterias.length > 0){
            retorno += "&materias="
            selectedMaterias.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        if(selectedBancas.length > 0){
            retorno += "&bancas="
            selectedBancas.forEach((i, index) => {
                retorno += index > 0 ? ";" + i.value : i.value;
            })
        }

        return retorno;
    }

    async function buscaDadosFiltro(tipo){
        let url = '';

        if(tipo == filtroBanca){
            url = '/Prova/GetAllBancas';
        }
        else if(tipo == filtroProva){
            url = '/Prova/GetAllProvasName';
        }
        else{
            url = '/Prova/GetAllMaterias';
        }

        await api.get(url + '?1=1' + montaBusca())
        .then((response) => {
            if(response.data.success){
                var t = [];
                response.data.object.forEach(element => {
                    t.push({
                        value: element,
                        label: element
                    })
                });

                if(tipo == filtroBanca){
                    setBancas(t);
                }
                else if(tipo == filtroProva){
                    setProvas(t);
                }
                else{
                    setMaterias(t);
                }
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar filtros');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar filtros');
        })
    }

    async function buscaQuestoes(page){
        await api.get('/Questoes/pagged' + '?page=' + page + '&quantity=' + quantityPerPage + '&anexos=false' + montaBusca())
        .then((response) => {
            if(response.data.success){
                setQuestoes(response.data.object);
                setQuantityQuestoes(response.data.total);
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar filtros');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar filtros');
        })
    }

    async function filtrarQuestoes(){
        setLoadding(true);

        buscaQuestoes(pageQuestoes);

        setLoadding(false);

        setFiltrando(false);
    }

    async function adicionaQuestao(item){
        setQuestoesAvaliacao(prevList => [...prevList, item]);
    }

    function removeItemFromList(idToRemove){
        var updatedList = questoesAvaliacao.filter(item => item.id !== idToRemove);
        setQuestoesAvaliacao(updatedList);
    };

    async function cadastrarAvaliacao(){

        if(nome == ''){
            toast.warn('Nome não foi preenchido!');
            return;
        }

        if(questoesAvaliacao.length == 0){
            toast.warn('Não foi selecionado nenhuma questão!');
            return;
        }

        var obj = {
            id: filtro,
            nome: nome,
            orientacao: orientacao,
            isPublic: isPublic ? "1" : "0",
            questoesAvaliacao: []
        };

        questoesAvaliacao.forEach(q => {
            obj.questoesAvaliacao.push({
                idQuestao: q.id,
                NotaQuestao: 1
            });
        });

        setLoadding(true);

        await api.post(acao == 'I' ? `/Avaliacao` : `/Avaliacao/Edit`, 
        obj
        )
        .then((response) => {
            if(response.data.success){
                toast.success('Avaliacao cadastrada com sucesso!');
                navigate('/listagemminhasavaliacoes/', {replace: true});
            }
            else{
                toast.info('Erro ao cadastrar');
                toast.warn(response.data.message);
            }
            setLoadding(false);
        }).catch(() => {
            setLoadding(false);
            toast.error('Erro ao criar avaliação!');
            return;
        });
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
            <Modal
                isOpen={modalQuestoesAvaliacao}
                onRequestClose={closeModalQuestoesAvaliacao}
                style={customStylesQuestoes}
                contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Questões da Avaliacao</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                    </th>
                                    <th>
                                        Numero Questao
                                    </th>
                                    <th>
                                        Matéria
                                    </th>
                                    <th>
                                        Prova
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    questoesAvaliacao?.slice((pageQuestoesAvaliacao - 1) * quantityPerPage, pageQuestoesAvaliacao * quantityPerPage)?.map((item, index) => {
                                        return(
                                            <tr key={item}>
                                                <td className='option'>
                                                    <h4 onClick={() => abreQuestao(item.id)}>
                                                        <VisibilityIcon className='vis' onClick={() => openModalQuestoesAvaliacao()}/>
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4>
                                                        {item.numeroQuestao}
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4>
                                                        {item.materia}
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4>
                                                        {item.prova?.nomeProva}
                                                    </h4>
                                                </td>
                                                <td>
                                                    <button className='global-button global-button' onClick={() => removeItemFromList(item.id)}>Remover</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className='itensPaginacao global-mt'>
                {
                    questoesAvaliacao.length > 0 ?
                        <Stack spacing={4}>
                            <Pagination sx={{
                    '& .Mui-selected': {
                        color: 'white'},
                    '& .MuiPaginationItem-root': {
                        color: 'white',
                  
                  }}} count={parseInt(Math.ceil(questoesAvaliacao.length / quantityPerPage))} page={parseInt(pageQuestoesAvaliacao)} color="primary" showFirstButton showLastButton onChange={handleChange} />
                        </Stack>
                        :
                        <>
                        </>
                }
                </div>
            </Modal>
            <Modal
                isOpen={modalQuestoes}
                onRequestClose={closeModalQuestoes}
                style={customStylesQuestoes}
                contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h3>Questões Disponíveis</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    {
                        filtrando == true ?
                        <>
                            <h3>Filtros</h3>
                            <div className='filtros-questoes'>
                                <h4>Bancas:</h4>
                                <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={bancas} value={selectedBancas} isMulti onChange={handleChangeSelectBanca} />
                                
                                <h4>Provas:</h4>
                                <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={provas} value={selectedProvas} isMulti onChange={handleChangeSelectProva} />
                                
                                <h4>Matérias:</h4>
                                <Select className='tiposProva' closeMenuOnSelect={false} components={animatedComponents} options={materias} value={selectedMaterias} isMulti onChange={handleChangeSelectMateria} />

                                <div className='botao-filtrar'>
                                    <button className='global-button global-button' onClick={filtrarQuestoes}>Filtrar</button>
                                </div>
                            </div>
                            <div className="separator separator--withMargins"></div>
                        </>
                        :
                        <>
                            <div className='total'>
                                <button className='global-button global-button--transparent' onClick={() => setFiltrando(true)}>Voltar para filtros</button>
                            </div>
                            <div>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>
                                            </th>
                                            <th>
                                                Numero Questao
                                            </th>
                                            <th>
                                                Matéria
                                            </th>
                                            <th>
                                                Prova
                                            </th>
                                            <th>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            questoes.map((item, index) => {
                                                return(
                                                    <tr key={item}>
                                                        <td className='option'>
                                                            <h4 onClick={() => abreQuestao(item.id)}>
                                                                <VisibilityIcon className='vis' onClick={() => openModalQuestoesAvaliacao()}/>
                                                            </h4>
                                                        </td>
                                                        <td>
                                                            <h4>
                                                                {item.numeroQuestao}
                                                            </h4>
                                                        </td>
                                                        <td>
                                                            <h4>
                                                                {item.materia}
                                                            </h4>
                                                        </td>
                                                        <td>
                                                            <h4>
                                                                {item.prova?.nomeProva}
                                                            </h4>
                                                        </td>
                                                        <td>
                                                            {
                                                                questoesAvaliacao.filter(i => item.id === i.id).length > 0 ?
                                                                <>
                                                                    <button className='global-button global-button' onClick={() => removeItemFromList(item.id)}>Remover</button>
                                                                </>
                                                                :
                                                                <>
                                                                    <button className='global-button global-button' onClick={() => adicionaQuestao(item)}>Selecionar</button>
                                                                </>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                            <div className="separator separator--withMargins"></div>
                            <h4>Total: {quantityQuestoes}</h4>
                            <div className='itensPaginacao global-mt'>
                            {
                                quantityQuestoes > 0 ?
                                    <Stack spacing={4}>
                                        <Pagination sx={{
                                '& .Mui-selected': {
                                    color: 'white'},
                                '& .MuiPaginationItem-root': {
                                    color: 'white',
                            
                            }}} count={parseInt(Math.ceil(quantityQuestoes / quantityPerPage))} page={parseInt(pageQuestoes)} color="primary" showFirstButton showLastButton onChange={handleChangeQuestoes} />
                                    </Stack>
                                    :
                                    <>
                                    </>
                            }
                            </div>
                        </>
                        }
                    </div>
            </Modal>
            <div className='global-infoPanel'>
                <h2 className='formularioCadastroProva'>
                    Cadastro de Avaliações
                </h2>
                <div className='criarUsuario'>
                    <h3>
                        Nome da Avaliação
                    </h3>
                    <input type='text' value={nome} onChange={(e) => setNome(e.target.value)}></input>
                    <h3>
                        Orientações
                    </h3>
                    <textarea type='text' value={orientacao} onChange={(e) => setOrientacao(e.target.value)} rows={10}></textarea>
                    <br/>
                    <div className='leftContent'>
                        <ToggleButton
                        value="check"
                        fullWidth={true}
                        selected={isPublic}
                        onChange={() => {
                            setIsPublic(!isPublic);
                            setColor(!isPublic);
                        }}
                        >
                            <CheckIcon className={classPublic}/> 
                            <h3>Avaliação é Pública</h3>
                        </ToggleButton>
                    </div>
                    <div className='leftContent'>
                        <h3>
                            Questões selecionadas: {questoesAvaliacao?.length} 
                        </h3>
                        <AddIcon className='vis' onClick={() => openModalQuestoes()}/>
                        <VisibilityIcon className='vis' onClick={() => openModalQuestoesAvaliacao()}/>
                    </div>
                    <div className='addQuestao'>
                        <button className='global-button global-button' onClick={cadastrarAvaliacao}>{acao == 'I' ? 'Cadastrar Avaliação' : 'Editar Avaliação'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CadastroAvaliacao;