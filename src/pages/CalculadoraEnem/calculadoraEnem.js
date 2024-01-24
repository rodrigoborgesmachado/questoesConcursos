import './calculadoraEnem.css';
import { useEffect, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import api from '../../services/api.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';

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
function CalculadoraEnem(){
    const animatedComponents = makeAnimated();
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [cursos, setCursos] = useState([]);
    const [filtro, setFiltro] = useState(0);
    const [pesos, setPesos] = useState([]);
    const [notas, setNotas] = useState([]);
    const [media, setMedia] = useState(0);
    const [canEditPeso, setCanEditPeso] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }
    
    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        async function buscaCursos() {
            
            await api.get('/Pesos/getCursos')
                .then((response) => {
                    let instituicao = [];
                    response.data.object.forEach(element => {
                        instituicao.push({
                            value: element.codigo,
                            label: element.nome
                        })
                    });
                    setCursos(instituicao);
                    setLoadding(false);
                }).catch(() => {
                    toast.error('Erro ao buscar instituições');
                    navigate('/', { replace: true });
                    return;
                });
        }
        setLoadding(true);
        buscaCursos();
    }, []);

    const handleChangeCurso = (selectedOptions, event) => {
        setFiltro(selectedOptions.value);
    }

    async function Buscar(){
        await api.get('/Pesos/getByCurso?curso=' + filtro)
        .then((response) => {
            let materias = [];
            var list = []
            response.data.object.forEach(element => {
                list.push(0);
                materias.push({
                    materia: element.materia,
                    peso:element.peso
                })
            });
            setPesos(materias);
            setNotas(list);
            setCanEditPeso(false);

            setLoadding(false);
        }).catch(() => {
            toast.error('Erro ao buscar instituições');
            navigate('/', { replace: true });
            return;
        });
    }

    function MontarPesos(){
        let materias = [];
        materias.push({
            materia: 'Redação',
            peso:0
        });
        
        materias.push({
            materia: 'Ciências da Natureza e suas Tecnologias',
            peso:0
        });
        
        materias.push({
            materia: 'Ciências Humanas e suas Tecnologias',
            peso:0
        });
        
        materias.push({
            materia: 'Linguagens, Códigos e suas Tecnologias',
            peso:0
        });
        
        materias.push({
            materia: 'Matemática e suas Tecnologias',
            peso:0
        });

        setPesos(materias);
        setNotas([0, 0, 0, 0, 0]);
    }

    function Calcular(){
        var somaPesos = 0;
        var somaValor = 0;
        pesos.forEach((i, index) => {
            somaPesos += parseInt(i.peso);
            somaValor += parseInt(i.peso) * parseInt(notas[index]);
        });

        setMedia((somaValor/somaPesos).toFixed(2));
        openModal();
    }

    function Voltar(){
        setFiltro(0);
        setPesos([]);
        setNotas([]);
        setMedia(0);
        setCanEditPeso(true);
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
              style={customStyles}
              contentLabel="Filtro"
            >
                <div className='contextModal'>
                    <div>
                        <h4>
                            Média para o curso {cursos.filter(function(option){return option.value == filtro})[0]?.label}:
                        </h4>
                        <h1 className="mediaCalculadora">
                            {media}
                        </h1>
                    </div>
                </div>
            </Modal>
            <div className="dados global-infoPanel">
                <h2>Calculadora de nota do Enem</h2>
                {
                    pesos.length == 0 ?
                    <div className="filtroSisu">
                        <h3>Pesos a partir dos termos de adesão da UFU. Caso queira simular para outra faculdade favor fonecer os pesos manualmente.</h3>
                        <h4>Curso da UFU:</h4>
                        <div className="opcoes">
                            <Select closeMenuOnSelect={false} components={animatedComponents} options={cursos} value={cursos.filter(function(option){return option.value == filtro})} onChange={handleChangeCurso} />
                        </div>
                        <div className='opcoesBotoesCalculadora'>
                            <Button className='global-button global-mt' onClick={() => Buscar()}>Filtrar</Button>
                            <Button className='global-button global-mt' onClick={() => MontarPesos()}>Entrar com os pesos manualmente</Button>
                        </div>
                    </div>
                    :
                    <div>
                        <h3>
                            {
                                canEditPeso ?
                                <></>
                                :
                                <>
                                    Curso: {cursos.filter(function(option){return option.value == filtro})[0]?.label}
                                </>
                            }
                            <div className="itensCalculadora">
                                {
                                    pesos.map((item, index) => {
                                        return(
                                            <div key={index} className="itemCalculadora">
                                                <h4>
                                                    {item.materia}
                                                </h4>
                                                <div className="dadosCalculadora">
                                                    <div className='pesoCalculadora'>
                                                        <h4>Peso:</h4>
                                                        {
                                                            canEditPeso ? 
                                                            <input type="number" value={item.peso} className="pesoCalculadora" 
                                                            onInput={(e) => 
                                                            {
                                                                setPesos([...pesos.slice(0, index), {materia: pesos[index].materia, peso: e.target.value}, ...pesos.slice(index+1)]);
                                                            }
                                                            }/>
                                                            :
                                                            <h4>
                                                                <b>
                                                                    {item.peso}
                                                                </b>
                                                            </h4>
                                                        }
                                                    </div>                                                        
                                                    <div className='pesoCalculadora'>
                                                        <h4>Nota:</h4>
                                                        <input type="number" value={notas[index]} className="pesoCalculadora"
                                                        onInput={(e) => 
                                                            {
                                                                setNotas([...notas.slice(0, index), e.target.value, ...notas.slice(index+1)]);
                                                            }
                                                            }
                                                            />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="opcoes">
                                <Button className='global-button global-mt' onClick={() => Calcular()}>Calcular média</Button>
                                <Button className='global-button global-mt' onClick={() => Voltar()}>Voltar</Button>
                            </div>
                        </h3>

                    </div>
                }
            </div>
        </div>
    )
}

export default CalculadoraEnem;