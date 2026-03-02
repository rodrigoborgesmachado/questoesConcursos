import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import PacmanLoader from '../../components/PacmanLoader/PacmanLoader';
import './style.css';

function QuestaoPublica() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [questao, setQuestao] = useState(null);

    function createMarkup(text) {
        return { __html: text };
    }

    function createMarkupWithImages(text, anexos) {
        let temp = text;

        for (let i = 0; i < anexos.length; i++) {
            temp = temp.replace(`<img src="#" alt="Anexo" id="divAnexo${i}"/>`, `<img src="${anexos[i].link}" alt="Anexo" id="divAnexo${i}"/>`);
        }

        return createMarkup(temp);
    }

    function entrarParaResponder() {
        const returnUrl = `/questoes/codigoquestaounica?id=${id}&page=1`;
        navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, { replace: true });
    }

    useEffect(() => {
        async function buscaQuestao() {
            await api.get(`/PublicQuestoes/questao-by-id?id=${id}`)
                .then((response) => {
                    if (response.data.success) {
                        setQuestao(response.data.object);
                    }
                    else {
                        toast.warn('Questão não encontrada');
                        navigate('/', { replace: true });
                    }
                    setLoadding(false);
                })
                .catch(() => {
                    toast.warn('Erro ao carregar questão');
                    navigate('/', { replace: true });
                });
        }

        buscaQuestao();
    }, [id, navigate]);

    if (loadding) {
        return <PacmanLoader />;
    }

    return (
        <div className='global-pageContainer-left'>
            <div className='global-infoPanel'>
                <h3>Visualização pública da questão</h3>
                <div className='separator separator--withMargins'></div>
                <h4 dangerouslySetInnerHTML={createMarkupWithImages(questao?.campoQuestao || '', questao?.anexosQuestoes || [])}></h4>
                <div className='questao-publica-opcoes'>
                    {questao?.respostasQuestoes?.map((item, index) => (
                        <div key={item.codigo || index} className='questao-publica-opcao'>
                            <input type='radio' disabled />
                            <span>{item.textoResposta}</span>
                        </div>
                    ))}
                </div>
                <div className='global-buttonWrapper global-mt'>
                    <button className='global-button global-button--transparent global-button--full-width' onClick={entrarParaResponder}>Entrar para responder</button>
                    <button className='global-button global-button--transparent global-button--full-width' onClick={() => navigate(-1)}>Voltar</button>
                </div>
            </div>
        </div>
    );
}

export default QuestaoPublica;
