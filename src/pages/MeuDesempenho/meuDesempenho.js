import '../Admin/DashBoard/DashBoard.css';
import { useCallback, useEffect, useState } from "react";
import api from '../../services/api.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Config from "../../config.json";
import BasicPie from './../../components/GraficoPie/graficoPie.js';
import { BarraDoisItensCorretosErrados } from '../../components/GraficoBarra/graficoBarra.js';
import PacmanLoader from "../../components/PacmanLoader/PacmanLoader.js";

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

function StatCard({ label, value, note }) {
    return (
        <div className="report-card">
            <span className="report-card-label">{label}</span>
            <strong className="report-card-value">{formatNumber(value)}</strong>
            {note && <span className="report-card-note">{note}</span>}
        </div>
    );
}

function ReportSection({ title, description, items }) {
    const list = safeList(items);
    const total = getTotalFromResponseList(list);
    const correct = getCorrectFromResponseList(list);
    const topItem = getTopItem(list);

    return (
        <section className="report-section global-infoPanel">
            <div>
                <h2 className="report-section-title">{title}</h2>
                <p className="report-section-description">{description}</p>
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
                {list.length > 0 ? <BarraDoisItensCorretosErrados itens={items}/> : <div className="report-empty">Sem dados para este recorte.</div>}
            </div>
        </section>
    );
}

export default function MeuDesempenho(){
    const navigate = useNavigate();
    const [loadding, setLoadding] = useState(true);
    const [dados, setDados] = useState({});

    const buscaDados = useCallback(async () => {
        setLoadding(true);

        try {
            const response = await api.get('/meudesempenho/analysis');
            setDados(response.data.object || {});
        } catch {
            toast.error('Erro ao buscar os dados');
            navigate('/', { replace: true });
        } finally {
            setLoadding(false);
        }
    }, [navigate]);

    useEffect(() => {
        buscaDados();
    }, [buscaDados]);

    const tentadas = Number(dados?.quantidadeQuestoesTentadas || 0);
    const corretas = Number(dados?.quantidadeQuestoesResolvidasCorretas || 0);
    const incorretas = Number(dados?.quantidadeQuestoesIncorretas || 0);
    const aproveitamento = formatPercent(corretas, tentadas);
    const totalAgrupado = [
        ...safeList(dados?.respostasPorProvas),
        ...safeList(dados?.respostasPorAvaliacao),
        ...safeList(dados?.respostasPorMateria),
        ...safeList(dados?.respostasPorBanca),
        ...safeList(dados?.respostasPorTipo)
    ].length;

    if (loadding) {
        return (
            <PacmanLoader/>
        );
    }

    return(
        <div className="containerpage global-fullW report-page">
            <section className="report-hero global-infoPanel">
                <div>
                    <span className="report-eyebrow">Relatório pessoal</span>
                    <h1 className="report-title">Meu desempenho</h1>
                    <p className="report-subtitle">
                        Acompanhe seu aproveitamento geral e veja em quais provas, matérias, bancas e tipos de questão você mais respondeu.
                    </p>
                </div>
                <div className="report-score">
                    <strong>{aproveitamento}</strong>
                    <span>aproveitamento</span>
                </div>
            </section>

            <section className="report-kpi-grid">
                <StatCard label="Questões tentadas" value={tentadas} note="total de respostas registradas" />
                <StatCard label="Acertos" value={corretas} note={`${aproveitamento} do total`} />
                <StatCard label="Erros" value={incorretas} note={`${formatPercent(incorretas, tentadas)} do total`} />
                <StatCard label="Recortes com dados" value={totalAgrupado} note="itens nos relatórios abaixo" />
            </section>

            <section className="report-grid report-grid--two">
                <div className="report-card">
                    <h2 className="report-section-title">Resumo de respostas</h2>
                    <p className="report-section-description">Distribuição entre respostas corretas e incorretas.</p>
                    {tentadas > 0 ? (
                        <BasicPie dados={makePieData('Corretas', corretas, 'Incorretas', incorretas)} />
                    ) : (
                        <div className="report-empty">Você ainda não possui respostas registradas.</div>
                    )}
                </div>
                <div className="report-card">
                    <h2 className="report-section-title">Leitura rápida</h2>
                    <div className="report-insights">
                        <div className="report-insight">
                            <strong>{aproveitamento}</strong>
                            <span>aproveitamento geral</span>
                        </div>
                        <div className="report-insight">
                            <strong>{formatNumber(corretas - incorretas)}</strong>
                            <span>saldo entre acertos e erros</span>
                        </div>
                        <div className="report-insight">
                            <strong>{formatNumber(tentadas)}</strong>
                            <span>questões no histórico</span>
                        </div>
                    </div>
                </div>
            </section>

            <ReportSection title="Respostas por prova" description="Veja onde você concentrou mais respostas e qual foi seu aproveitamento." items={dados?.respostasPorProvas} />
            <ReportSection title="Respostas por avaliação" description="Comparativo de acertos e erros nas avaliações realizadas." items={dados?.respostasPorAvaliacao} />
            <ReportSection title="Respostas por matéria" description="Use este recorte para encontrar matérias fortes e pontos de reforço." items={dados?.respostasPorMateria} />
            <ReportSection title="Respostas por banca" description="Acompanhe seu comportamento por banca examinadora." items={dados?.respostasPorBanca} />
            <ReportSection title="Respostas por tipo" description="Entenda o volume e o acerto por tipo de questão." items={dados?.respostasPorTipo} />
        </div>
    );
}
