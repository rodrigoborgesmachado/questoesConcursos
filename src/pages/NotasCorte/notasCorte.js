import './notasCorte.css';
import { useEffect, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import api from '../../services/api.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import Modal from 'react-modal';
import { customStyles } from '../../services/functions.js';

function NotasCorte(){
    const style = customStyles();
    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const [instituicoes, setInstituicoes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [dadosCurso, setDadosCurso] = useState([]);
    const [modosConcorrencia, setModosConcorrencia] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [filtro, setFiltro] = useState(
        {
            instituicao:[],
            curso:[]
        }
    );
    const [loadding, setLoadding] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [indexModoConcorrencia, setIndexModoConcorrencia] = useState(-1);

    function openModal(index) {
        setIndexModoConcorrencia(index);
        setIsOpen(true);

    }
    
    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        async function buscaInstituicoes() {
            
            await api.get('/NotasCorteSisu/getInstituicoes')
                .then((response) => {
                    let instituicao = [];
                    response.data.object.forEach(element => {
                        instituicao.push({
                            value: element.codigo,
                            label: element.nome
                        })
                    });
                    setInstituicoes(instituicao);
                    setLoadding(false);
                }).catch(() => {
                    toast.error('Erro ao buscar instituições');
                    navigate('/', { replace: true });
                    return;
                });
        }
        setLoadding(true);
        buscaInstituicoes();

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Adjust the threshold as needed
        };
      
        // Initial check on component mount
        handleResize();
      
        // Listen for window resize events
        window.addEventListener('resize', handleResize);
    }, []);

    async function buscaCursos(instituicao) {
        setLoadding(true);
        await api.get('/NotasCorteSisu/getCursosFromInstituicao?codigoInstituicao=' + instituicao)
        .then((response) => {
            let curso = [];
            response.data.object.forEach(element => {
                curso.push({
                    value: element.codigo,
                            label: element.nome
                })
            });
            setCursos(curso);
            setLoadding(false);
        }).catch(() => {
            toast.error('Erro ao buscar cursos');
            navigate('/', { replace: true });
            return;
        });
    }

    async function buscaResultados() {
        setLoadding(true);
        await api.get('/NotasCorteSisu/getNotasFromCursoEInstituicao?instituicao=' + filtro.instituicao + '&curso=' + filtro.curso)
        .then((response) => {

            setDadosCurso({
                nomeInstituicao: response.data.object[0].nomeInstituicao,
                siglaInstituicao: response.data.object[0].siglaInstituicao,
                nomeCampus: response.data.object[0].nomeCampus,
                nomeMunicipioCampus: response.data.object[0].nomeMunicipioCampus,
                ufCampus: response.data.object[0].ufCampus,
                nomeCurso: response.data.object[0].nomeCurso,
            });

            var unique = new Set(response.data.object.map(o => o.desricaoModoConcorrencia));
            setModosConcorrencia([...unique]);
            var list = [];
            var notaCorte2019;
            var notaCorte2020;
            var notaCorte2021;
            var notaCorte2022;
            var notaCorte2023;
            unique.forEach(item => {
                var temp = response.data.object.filter(o => o.desricaoModoConcorrencia === item);
                notaCorte2019 = temp.filter(t => t.year === 2019)[0]?.notaCorte;
                notaCorte2020 = temp.filter(t => t.year === 2020)[0]?.notaCorte;
                notaCorte2021 = temp.filter(t => t.year === 2021)[0]?.notaCorte;
                notaCorte2022 = temp.filter(t => t.year === 2022)[0]?.notaCorte;
                notaCorte2023 = temp.filter(t => t.year === 2023)[0]?.notaCorte;
                list.push({
                    corte2019: notaCorte2019,
                    corte2020: notaCorte2020,
                    corte2021: notaCorte2021,
                    corte2022: notaCorte2022,
                    corte2023: notaCorte2023,
                })
            });
            setResultados(list);
            console.log(list);
            setLoadding(false);
        }).catch(() => {
            toast.error('Erro ao buscar cursos');
            navigate('/', { replace: true });
            return;
        });
    }

    const handleChangeInstituicao = (selectedOptions, event) => {
        setFiltro({
            instituicao:selectedOptions.value,
            curso:filtro.curso
        });

        buscaCursos(selectedOptions.value);
    }

    const handleChangeCurso = (selectedOptions, event) => {
        setFiltro({
            instituicao:filtro.instituicao,
            curso:selectedOptions.value
        });
    }

    function Buscar(){
        buscaResultados()
    }

    function Limpar(){
        setResultados([]);
        setDadosCurso([]);
        setModosConcorrencia([]);
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
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              style={style}
              contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div className='bodymodal'>
                        <h4>
                            {modosConcorrencia[indexModoConcorrencia]}
                        </h4>
                    </div>
                </div>
            </Modal>
            <div className="dados global-infoPanel">
                <h2>Notas de Corte Sisu:</h2>
                {
                    resultados.length == 0 ?
                    <div className="filtroSisu">
                        <h3>Notas a partir do site do sisu, na aba relatórios. Preencha os filtros a seguir para visualizar os resultados:</h3>
                        <h4>Instituição:</h4>
                        <div className="opcoes">
                            <Select closeMenuOnSelect={false} components={animatedComponents} options={instituicoes} value={instituicoes.filter(function(option){return option.value == filtro.instituicao})} onChange={handleChangeInstituicao} />
                        </div>
                        <h4>Curso:</h4>
                        <div className="opcoes">
                            <Select closeMenuOnSelect={false} components={animatedComponents} options={cursos} value={cursos.filter(function(option){return option.value == filtro.curso})} onChange={handleChangeCurso} />
                        </div>
                        <div className="opcoes">
                            <Button className='global-button global-mt' onClick={() => Buscar()}>Filtrar</Button>
                        </div>
                    </div>
                    :
                    <div>
                        <br/>
                        <h4>{dadosCurso.nomeInstituicao} - {dadosCurso.siglaInstituicao} | {dadosCurso.nomeCampus} | {dadosCurso.nomeMunicipioCampus}/{dadosCurso.ufCampus}</h4>
                        <br/>
                        <h4>{dadosCurso.nomeCurso}</h4>
                        <br/>
                        <br/>
                        <h3>Notas de Corte:</h3>
                        {
                            isMobile ? 
                            <Table>
                                <thead>
                                    <tr>
                                        <th>
                                            <h3>
                                                Modo Concorrência
                                            </h3>
                                        </th>
                                        <th>
                                            <h3>
                                                2022
                                            </h3>
                                        </th>
                                        <th>
                                            <h3>
                                                2023
                                            </h3>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        resultados.map((item, index) => {
                                            return(
                                                <tr key={index}>
                                                    <td onClick={() => openModal(index)} className='pointer'>
                                                        {(index+1)}
                                                    </td>
                                                    <td>
                                                        {item.corte2022}
                                                    </td>
                                                    <td>
                                                        {item.corte2023}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                            :
                            <Table>
                                <thead>
                                    <tr>
                                        <th>
                                            <h3>
                                                Modo Concorrência
                                            </h3>
                                        </th>
                                        <th>
                                            <h3>
                                                2019
                                            </h3>
                                        </th>
                                        <th>
                                            <h3>
                                                2020
                                            </h3>
                                        </th>
                                        <th>
                                            <h3>
                                                2021
                                            </h3>
                                        </th>
                                        <th>
                                            <h3>
                                                2022
                                            </h3>
                                        </th>
                                        <th>
                                            <h3>
                                                2023
                                            </h3>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        resultados.map((item, index) => {
                                            return(
                                                <tr key={index}>
                                                    <td onClick={() => openModal(index)} className='pointer'>
                                                        {(index+1)}
                                                    </td>
                                                    <td>
                                                        {item.corte2019}
                                                    </td>
                                                    <td>
                                                        {item.corte2020}
                                                    </td>
                                                    <td>
                                                        {item.corte2021}
                                                    </td>
                                                    <td>
                                                        {item.corte2022}
                                                    </td>
                                                    <td>
                                                        {item.corte2023}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        }
                        <br/>
                        <div>
                            <h4><b>Obs: Notas zeradas significa que não houve candidatos, notas vazias significa que não houve a modalidade naquele ano.</b></h4>
                        </div>
                        <br/>
                        <h4>Modos de concorrência:</h4>
                        <br/>
                        {
                            modosConcorrencia.map((item, index) => {
                                return(
                                    <div key={index}>
                                        <h4>
                                            {(index + 1)} - {item}
                                        </h4>
                                        <br/>
                                    </div>
                                )
                            })
                        }
                        <br/>
                        <div className="opcoes">
                            <Button className='global-button global-mt' onClick={() => Limpar()}>Refazer Busca</Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default NotasCorte;