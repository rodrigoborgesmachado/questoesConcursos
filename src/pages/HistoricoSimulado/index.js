import './historicosimulado.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {toast} from 'react-toastify';
import Config from './../../config.json';
import { Table } from 'react-bootstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function HistoricoSimulado(){
    const animatedComponents = makeAnimated();
    const[lista, setLista] = useState([]);
    const navigate = useNavigate();
    const[loadding, setLoadding] = useState(true);
    const[usuarios, setUsuarios] = useState([]);
    const [quantityPerPage] = useState(1000);
    const[usuarioFiltro, setUsuarioFiltro] = useState([]);

    if(localStorage.getItem(Config.LOGADO) == null || localStorage.getItem(Config.LOGADO) === '0'){
        navigate('/', {replace: true});
    }

    async function buscaUsuarios(){
        setLoadding(true);
        await api.get('/Usuarios')
        .then((response) => {
            if(response.data.success){
                var prov = [];
                response.data.object.forEach(element => {
                    prov.push({
                        value: element.id,
                        label: element.nome
                    })
                });
                setUsuarios(prov);
                setLoadding(false);
            }
            else{
                navigate('/', {replace: true});
                toast.warn('Erro ao buscar');    
            }
        })
        .catch(() => {
            navigate('/', {replace: true});
            toast.warn('Erro ao buscar');
        })
    }

    async function BuscarSimulados(page, user){
        setLoadding(true);

        var url = `/Simulado/pagged?page=` + page + `&quantity=` + quantityPerPage;

        if(user !== undefined){
            url += `&codeUser=` + user;
        }

        await api.get(url)
        .then(response => {
            setLista(response.data.object);
            setLoadding(false);
        })
        .catch(exception => {
            toast.warn(exception);
            setLoadding(false);
        });
    }

    useEffect(() => {
        setLoadding(true);

        if(localStorage.getItem(Config.ADMIN) === '1')
        {
            buscaUsuarios();
        }
        else{
            BuscarSimulados(1);
        }
    }, [])

    function abreResultado(codigoResultado){
        navigate('/resultadosimulado/' + codigoResultado, {replace: true});
    }

    const handleUsuarios = (selectedOptions, event) => {
        setUsuarioFiltro(selectedOptions.label);
        BuscarSimulados(1, selectedOptions.value);
    }

    if(loadding){
        return(
            <div className='loaddingDiv'>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }

    return (
        <div className='containerpage global-fullW'>
            <div className='dados global-infoPanel'>
                <h2>
                    Histórico de Simulados
                </h2>
                <br/>
                <div className='dadosResumidos'>
                    {
                        localStorage.getItem(Config.ADMIN) === '1' ?
                        <div className='formUsuario'>
                            <div className='selectUsuario'>
                                <p>Usuário:</p>
                                <Select closeMenuOnSelect={false} components={animatedComponents} options={usuarios} onChange={handleUsuarios} style={{width: '100%'}}/>
                            </div>
                        </div>
                        :
                        <></>
                    }
                    {
                        usuarioFiltro ?
                        <h3>
                            Simulados feitos por: {usuarioFiltro}
                        </h3>
                        :
                        <></>
                    }

                    <Table>
                    <thead>
                        <tr>
                            <th>
                                <h3>
                                Prova
                                </h3>
                            </th>
                            <th>
                                <h3>
                                Quantidade Questões
                                </h3>
                            </th>
                            <th>
                                <h3>
                                Nº acertos
                                </h3>
                            </th>
                            <th>
                                <h3>
                                Tempo
                                </h3>
                            </th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            lista?.map((item, index) => {
                            return(
                                <tr key={index}>
                                    <td>
                                        <h4>
                                            {
                                                item.prova.nomeProva
                                            }
                                        </h4>
                                    </td>
                                    <td>
                                        <h4>
                                            {item.quantidadeQuestoes}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4>
                                            {item.quantidadeCertas}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4>
                                            {Math.round(item.tempo/60)} minutos
                                        </h4>
                                    </td>
                                    <td>
                                        <h4>
                                            <button onClick={() => abreResultado(item.codigo)} className='global-button'>Visualizar</button>
                                        </h4>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default HistoricoSimulado;