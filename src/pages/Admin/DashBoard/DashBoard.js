import './DashBoard.css';
import { useCallback, useEffect, useState } from "react";
import api from '../../../services/api.js';
import Config from "../../../config.json";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import Modal from 'react-modal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { paginationSx } from '../../../services/uiStyles.js';
import { customStyles } from '../../../services/functions.js';
import { abreQuestao } from './../../../services/functions.js';
import BasicPie from './../../../components/GraficoPie/graficoPie.js';
import { BasicBars, BarraDoisItensCorretosErrados } from '../../../components/GraficoBarra/graficoBarra.js';
import PacmanLoader from '../../../components/PacmanLoader/PacmanLoader.js';

const quantityPerPage = 8;
const numberFormatter = new Intl.NumberFormat('pt-BR');

function safeList(list) {
    return Array.isArray(list) ? list : [];
}

function formatNumber(value) {
    return numberFormatter.format(Number(value || 0));
}

function formatPercent(value, total) {
    if (!total) {
        return '0%';
    }

    return `${Math.round((value / total) * 100)}%`;
}

function formatDate(data) {
    if (!data) {
        return '-';
    }

    const datePart = data.split('T')[0];
    const parts = datePart.split('-');

    if (parts.length !== 3) {
        return data;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getItemId(item) {
    return item?.id ?? item?.Id;
}

function getTotalFromResponseList(list) {
    return safeList(list).reduce((total, item) => total + Number(item.certas || 0) + Number(item.erradas || 0), 0);
}

function getCorrectFromResponseList(list) {
    return safeList(list).reduce((total, item) => total + Number(item.certas || 0), 0);
}

function getTopItem(list) {
    return safeList(list).reduce((top, item) => {
        const currentTotal = Number(item.certas || 0) + Number(item.erradas || 0);
        const topTotal = top ? Number(top.certas || 0) + Number(top.erradas || 0) : -1;
        return currentTotal > topTotal ? item : top;
    }, null);
}

function makePieData(primaryLabel, primaryValue, secondaryLabel, secondaryValue) {
    return [
        {
            id: 0,
            value: Number(primaryValue || 0),
            color: Config.pallete[0],
            label: `${primaryLabel}: ${formatNumber(primaryValue)}`
        },
        {
            id: 1,
            value: Number(secondaryValue || 0),
            color: Config.pallete[1],
            label: `${secondaryLabel}: ${formatNumber(secondaryValue)}`
        }
    ];
}

function StatCard({ label, value, note, action }) {
    return (
        <div className={`report-card ${action ? 'report-card--action' : ''}`}>
            <div>
                <span className="report-card-label">{label}</span>
                <strong className="report-card-value">{formatNumber(value)}</strong>
                {note && <span className="report-card-note">{note}</span>}
            </div>
            {action}
        </div>
    );
}

function ReportSection({ title, description, items, children }) {
    const list = safeList(items);
    const total = getTotalFromResponseList(list);
    const correct = getCorrectFromResponseList(list);
    const topItem = getTopItem(list);

    return (
        <section className="report-section global-infoPanel">
            <div className="report-section-header">
                <div>
                    <h2 className="report-section-title">{title}</h2>
                    <p className="report-section-description">{description}</p>
                </div>
            </div>
            {list.length > 0 && (
                <div className="report-insights">
                    <div className="report-insight">
                        <strong>{formatNumber(total)}</strong>
                        <span>respostas registradas</span>
                    </div>
                    <div className="report-insight">
                        <strong>{formatPercent(correct, total)}</strong>
                        <span>de aproveitamento</span>
                    </div>
                    <div className="report-insight">
                        <strong>{topItem?.descricao || '-'}</strong>
                        <span>maior volume</span>
                    </div>
                </div>
            )}
            <div className="report-chart-card">
                {list.length > 0 ? children : <div className="report-empty">Sem dados para este recorte.</div>}
            </div>
        </section>
    );
}

function SimpleChartSection({ title, description, hasData, children }) {
    return (
        <section className="report-section global-infoPanel">
            <div>
                <h2 className="report-section-title">{title}</h2>
                <p className="report-section-description">{description}</p>
            </div>
            <div className="report-chart-card">
                {hasData ? children : <div className="report-empty">Sem dados para este recorte.</div>}
            </div>
        </section>
    );
}

function SummaryMetric({ label, value, note }) {
    return (
        <div className="report-insight">
            <strong>{value}</strong>
            <span>{label}</span>
            {note && <span>{note}</span>}
        </div>
    );
}

function DashBoard(){
    const styles = customStyles();
    const navigate = useNavigate();
    const [dados, setDados] = useState({});
    const [questoesPorUsuarios, setQuestoesPorUsuarios] = useState([]);
    const [questoesValidadasPorUsuarios, setQuestoesValidadasPorUsuarios] = useState([]);
    const [loadding, setLoadding] = useState(true);
    const [questoes, setQuestoes] = useState([]);
    const [provas, setProvas] = useState([]);
    const [modalQuestoesIsOpen, setModalQuestoesIsOpen] = useState(false);
    const [modalProvasIsOpen, setModalProvasIsOpen] = useState(false);
    const [pageQuestoes, setPageQuestoes] = useState(1);
    const [pageProvas, setPageProvas] = useState(1);
    const [quantityQuestoes, setQuantityQuestoes] = useState(1);
    const [quantityProvas, setQuantityProvas] = useState(1);

    const buscaDados = useCallback(async () => {
        setLoadding(true);

        try {
            const [analysisResponse, questoesResponse, validadasResponse] = await Promise.all([
                api.get('/Admin/analysis'),
                api.get('/Admin/getquantidadequestoescadastradasporusuarios'),
                api.get('/Admin/getquantidadequestoesvalidadasporusuarios')
            ]);

            const analysis = analysisResponse.data.object || {};
            setDados(analysis);
            setQuantityQuestoes(analysis.quantidadeQuestoesSolicitadasRevisao || 0);
            setQuantityProvas(analysis.quantidadeProvasDesativasAtivas || 0);
            setQuestoesPorUsuarios(questoesResponse.data.object || []);
            setQuestoesValidadasPorUsuarios(validadasResponse.data.object || []);
        } catch {
            toast.error('Erro ao buscar os dados');
            navigate('/', { replace: true });
        } finally {
            setLoadding(false);
        }
    }, [navigate]);

    async function buscaQuestoesParaRevisao(nextPage = 1) {
        setLoadding(true);

        try {
            const response = await api.get(`/Admin/questoespararevisao?page=${nextPage}&quantity=${quantityPerPage}`);
            setQuestoes(response.data.object || []);
            setPageQuestoes(nextPage);
            setModalQuestoesIsOpen(true);
        } catch {
            toast.error('Erro ao buscar os dados');
            navigate('/', { replace: true });
        } finally {
            setLoadding(false);
        }
    }

    async function buscaProvasParaRevisao(nextPage = 1){
        setLoadding(true);

        try {
            const response = await api.get(`/Admin/provaspararevisao?page=${nextPage}&quantity=${quantityPerPage}`);
            setProvas(response.data.object || []);
            setPageProvas(nextPage);
            setModalProvasIsOpen(true);
        } catch {
            toast.error('Erro ao buscar os dados');
            navigate('/', { replace: true });
        } finally {
            setLoadding(false);
        }
    }

    useEffect(() => {
        buscaDados();
    }, [buscaDados]);

    function abreProva(codigoProva){
        navigate('/listagemquestoes/' + codigoProva, {replace: true});
    }

    const totalUsuarios = Number(dados?.quantidadeTotal || 0);
    const totalRespostas = Number(dados?.quantidadeRespostas || 0);
    const respostasCertas = Number(dados?.quantidadeRespostasCertas || 0);
    const taxaAcerto = formatPercent(respostasCertas, totalRespostas);
    const usuariosPendentes = Number(dados?.quantidadeNaoVerificados || 0);
    const respostasUltimos30Dias = Number(dados?.quantidadeRespostasUltimas30Dias || 0);
    const tabuadaTotal = Number(dados?.quantidadeRespostasTabuadaDivertida || 0);
    const tabuadaUltimos30Dias = Number(dados?.quantidadeRespostasTabuadaDivertidaUltimas30Dias || 0);
    const tabuadaPercentualRecente = tabuadaTotal ? Math.round((tabuadaUltimos30Dias / tabuadaTotal) * 100) : 0;

    const nomesQuestoesCadastradas = safeList(questoesPorUsuarios).map((item) => item.descricao);
    const valoresQuestoesCadastradas = safeList(questoesPorUsuarios).map((item) => item.valor);
    const nomesQuestoesValidadas = safeList(questoesValidadasPorUsuarios).map((item) => item.descricao);
    const valoresQuestoesValidadas = safeList(questoesValidadasPorUsuarios).map((item) => item.valor);
    const nomesUsuariosCadastrados = safeList(dados?.usuariosDates).map((item) => formatDate(item.date));
    const valoresUsuariosCadastrados = safeList(dados?.usuariosDates).map((item) => item.count);

    if (loadding) {
        return (
            <PacmanLoader/>
        );
    }

    return (
        <div className="containerpage global-fullW report-page">
            <Modal
                isOpen={modalQuestoesIsOpen}
                onRequestClose={() => setModalQuestoesIsOpen(false)}
                style={styles}
                contentLabel="Questões para revisão"
            >
                <div className='contextModal global-modal report-modal-content'>
                    <div className='bodymodal'>
                        <h3>Questões com revisão solicitada</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div className="global-tableWrap">
                        <Table className='global-table'>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Matéria</th>
                                    <th>Prova</th>
                                    <th>Número da questão</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questoes.map((item) => (
                                    <tr key={getItemId(item)}>
                                        <td>
                                            <span className="report-table-action" onClick={() => abreQuestao(getItemId(item))}>
                                                Ver #{getItemId(item)}
                                            </span>
                                        </td>
                                        <td>{item.materia}</td>
                                        <td>{item.prova?.nomeProva}</td>
                                        <td>{item.numeroQuestao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className='itensPaginacao global-mt global-pagination'>
                    {quantityQuestoes > 0 && (
                        <Stack spacing={4}>
                            <Pagination sx={paginationSx} count={parseInt(Math.ceil(quantityQuestoes / quantityPerPage))} page={parseInt(pageQuestoes)} color="primary" showFirstButton showLastButton onChange={(event, value) => buscaQuestoesParaRevisao(value)} />
                        </Stack>
                    )}
                </div>
            </Modal>

            <Modal
                isOpen={modalProvasIsOpen}
                onRequestClose={() => setModalProvasIsOpen(false)}
                style={styles}
                contentLabel="Provas em revisão"
            >
                <div className='contextModal global-modal report-modal-content'>
                    <div className='bodymodal'>
                        <h3>Provas em revisão</h3>
                    </div>
                    <div className="separator separator--withMargins"></div>
                    <div className="global-tableWrap">
                        <Table className='global-table'>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nome</th>
                                    <th>Banca</th>
                                    <th>Cadastro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {provas.map((item) => (
                                    <tr key={getItemId(item)}>
                                        <td>
                                            <span className="report-table-action" onClick={() => abreProva(getItemId(item))}>
                                                Ver #{getItemId(item)}
                                            </span>
                                        </td>
                                        <td>{item.nomeProva}</td>
                                        <td>{item.banca}</td>
                                        <td>{formatDate(item.dataRegistro)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className='itensPaginacao global-mt global-pagination'>
                    {quantityProvas > 0 && (
                        <Stack spacing={4}>
                            <Pagination sx={paginationSx} count={parseInt(Math.ceil(quantityProvas / quantityPerPage))} page={parseInt(pageProvas)} color="primary" showFirstButton showLastButton onChange={(event, value) => buscaProvasParaRevisao(value)} />
                        </Stack>
                    )}
                </div>
            </Modal>

            <section className="report-hero global-infoPanel">
                <div>
                    <span className="report-eyebrow">Painel administrativo</span>
                    <h1 className="report-title">Dashboard</h1>
                    <p className="report-subtitle">
                        Visão consolidada de usuários, respostas e itens que precisam de revisão.
                    </p>
                </div>
                <div className="report-score">
                    <strong>{taxaAcerto}</strong>
                    <span>acerto geral</span>
                </div>
            </section>

            <section className="report-kpi-grid">
                <StatCard label="Usuários" value={totalUsuarios} note={`${formatNumber(dados?.quantidadeUsuarios30Dias)} nos últimos 30 dias`} />
                <StatCard label="Respostas" value={totalRespostas} note={`${formatNumber(respostasUltimos30Dias)} nos últimos 30 dias`} />
                <StatCard label="Questões ativas" value={dados?.quantidadeQuestoesAtivas} note={`${formatNumber(dados?.quantidadeQuestoesSolicitadasRevisao)} pedindo revisão`} />
                <StatCard label="Provas ativas" value={dados?.quantidadeProvasAtivas} note={`${formatNumber(dados?.quantidadeProvasDesativasAtivas)} em aberto`} />
            </section>

            <section className="report-grid report-grid--two">
                <div className="report-card">
                    <h2 className="report-section-title">Usuários verificados</h2>
                    <p className="report-section-description">{formatNumber(usuariosPendentes)} contas ainda precisam de verificação.</p>
                    <BasicPie dados={makePieData('Verificados', dados?.quantidadeVerificados, 'Não verificados', dados?.quantidadeNaoVerificados)} />
                </div>
                <div className="report-card">
                    <h2 className="report-section-title">Atividade recente</h2>
                    <p className="report-section-description">Participação dos últimos 30 dias no volume total de respostas.</p>
                    <BasicPie dados={makePieData('Últimos 30 dias', respostasUltimos30Dias, 'Histórico anterior', totalRespostas - respostasUltimos30Dias)} />
                </div>
            </section>

            <section className="report-grid report-grid--two">
                <StatCard
                    label="Questões para revisão"
                    value={dados?.quantidadeQuestoesSolicitadasRevisao}
                    note="Abra a fila para validar correções solicitadas."
                    action={<button className="report-action-button" type="button" onClick={() => buscaQuestoesParaRevisao(1)} aria-label="Ver questões para revisão"><VisibilityIcon /></button>}
                />
                <StatCard
                    label="Provas em aberto"
                    value={dados?.quantidadeProvasDesativasAtivas}
                    note="Acompanhe provas pendentes antes de publicar."
                    action={<button className="report-action-button" type="button" onClick={() => buscaProvasParaRevisao(1)} aria-label="Ver provas em revisão"><VisibilityIcon /></button>}
                />
            </section>

            <ReportSection title="Respostas por prova" description="Volume e aproveitamento agrupados por prova." items={dados?.respostasPorProvas}>
                <BarraDoisItensCorretosErrados itens={dados?.respostasPorProvas}/>
            </ReportSection>

            <ReportSection title="Respostas por avaliação" description="Comparação entre acertos e erros em avaliações." items={dados?.respostasPorAvaliacao}>
                <BarraDoisItensCorretosErrados itens={dados?.respostasPorAvaliacao}/>
            </ReportSection>

            <ReportSection title="Respostas por matéria" description="Matérias com maior participação e melhor leitura de desempenho." items={dados?.respostasPorMateria}>
                <BarraDoisItensCorretosErrados itens={dados?.respostasPorMateria}/>
            </ReportSection>

            <ReportSection title="Respostas por banca" description="Distribuição de respostas por banca." items={dados?.respostasPorBanca}>
                <BarraDoisItensCorretosErrados itens={dados?.respostasPorBanca}/>
            </ReportSection>

            <ReportSection title="Respostas por tipo" description="Desempenho por tipo de questão." items={dados?.respostasPorTipo}>
                <BarraDoisItensCorretosErrados itens={dados?.respostasPorTipo}/>
            </ReportSection>

            <SimpleChartSection title="Questões cadastradas por usuário" description="Quem mais contribuiu com cadastro de questões." hasData={questoesPorUsuarios.length > 0}>
                <BasicBars nomes={nomesQuestoesCadastradas} dados={valoresQuestoesCadastradas}/>
            </SimpleChartSection>

            <SimpleChartSection title="Questões validadas por usuário" description="Quem mais atuou na validação de questões." hasData={questoesValidadasPorUsuarios.length > 0}>
                <BasicBars nomes={nomesQuestoesValidadas} dados={valoresQuestoesValidadas}/>
            </SimpleChartSection>

            <SimpleChartSection title="Usuários cadastrados nos últimos 30 dias" description="Evolução diária de novos usuários." hasData={safeList(dados?.usuariosDates).length > 0}>
                <BasicBars nomes={nomesUsuariosCadastrados} dados={valoresUsuariosCadastrados}/>
            </SimpleChartSection>

            <section className="report-section global-infoPanel">
                <div>
                    <h2 className="report-section-title">Tabuada Divertida</h2>
                    <p className="report-section-description">Resumo de uso do módulo e participação da atividade recente no histórico.</p>
                </div>
                <div className="report-summary-row">
                    <SummaryMetric label="respostas no total" value={formatNumber(tabuadaTotal)} />
                    <SummaryMetric label="respostas nos últimos 30 dias" value={formatNumber(tabuadaUltimos30Dias)} />
                    <SummaryMetric label="participação recente" value={`${tabuadaPercentualRecente}%`} note={`${formatNumber(Math.max(tabuadaTotal - tabuadaUltimos30Dias, 0))} no histórico anterior`} />
                </div>
                <div className="report-progress" aria-label="Participação dos últimos 30 dias na Tabuada Divertida">
                    <div className="report-progress-bar" style={{ width: `${Math.min(tabuadaPercentualRecente, 100)}%` }} />
                </div>
            </section>
        </div>
    );
}

export default DashBoard;
