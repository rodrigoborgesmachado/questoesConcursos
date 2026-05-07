import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = (process.env.REACT_APP_SITE_URL || 'https://www.questoesaqui.com').replace(/\/$/, '');

const DEFAULT_TITLE = 'Questoes Aqui - Questoes de Concurso, Enem e Vestibulares';
const DEFAULT_DESCRIPTION = 'Site de questoes de concurso, Enem e Vestibulares. Ideal para quem busca aprender de forma gratuita e treinar seus conhecimentos.';

const SEO_BY_PATH = {
    '/': {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
    },
    '/contato': {
        title: 'Contato | Questoes Aqui',
        description: 'Entre em contato com o Questoes Aqui para duvidas, sugestoes e informacoes sobre a plataforma.',
    },
    '/privacidade': {
        title: 'Politica de Privacidade | Questoes Aqui',
        description: 'Conheca a politica de privacidade do Questoes Aqui e como os dados sao tratados na plataforma.',
    },
    '/termos': {
        title: 'Termos de Uso | Questoes Aqui',
        description: 'Consulte os termos de uso da plataforma Questoes Aqui.',
    },
    '/sobre': {
        title: 'Sobre | Questoes Aqui',
        description: 'Conheca o Questoes Aqui, uma plataforma para estudar questoes de concurso, Enem e vestibulares.',
    },
    '/notasCorte': {
        title: 'Notas de Corte | Questoes Aqui',
        description: 'Consulte notas de corte para apoiar seu planejamento de estudos e escolhas academicas.',
    },
    '/calculadoraEnem': {
        title: 'Calculadora Enem | Questoes Aqui',
        description: 'Calcule estimativas relacionadas ao Enem e acompanhe melhor seu desempenho.',
    },
    '/listagemprovas': {
        title: 'Provas | Questoes Aqui',
        description: 'Encontre provas de concursos, Enem e vestibulares para estudar e praticar.',
    },
    '/listagemquestoes': {
        title: 'Questoes | Questoes Aqui',
        description: 'Liste questoes de concursos, Enem e vestibulares por prova, materia e assunto.',
    },
};

const NOINDEX_PREFIXES = [
    '/login',
    '/criarUsuario',
    '/recoverypass',
    '/resetpass',
    '/valida',
    '/confirmesuaconta',
    '/materias',
    '/bancas',
    '/simulado',
    '/ranking',
    '/historico',
    '/perfil',
    '/questoes',
    '/resultadosimulado',
    '/historicosimulado',
    '/atualizasenha',
    '/avaliacoes',
    '/meudesempenho',
    '/resultadoAvaliacao',
    '/cadastroProva',
    '/cadastraQuestao',
    '/historicoadmin',
    '/dashboard',
    '/logs',
    '/usuarios',
    '/historicotabuadadivertida',
    '/historicorespostas',
    '/cadastroavaliacao',
    '/listagemminhasavaliacoes',
];

function upsertMeta(selector, createElement, updateElement) {
    let element = document.head.querySelector(selector);

    if (!element) {
        element = createElement();
        document.head.appendChild(element);
    }

    updateElement(element);
}

function getSeoForPath(pathname) {
    if (SEO_BY_PATH[pathname]) {
        return SEO_BY_PATH[pathname];
    }

    if (pathname.startsWith('/listagemprovas/')) {
        return {
            title: 'Prova | Questoes Aqui',
            description: 'Veja questoes vinculadas a uma prova publica no Questoes Aqui.',
        };
    }

    if (pathname.startsWith('/listagemquestoes/')) {
        return {
            title: 'Questoes da Prova | Questoes Aqui',
            description: 'Consulte questoes publicas vinculadas a uma prova no Questoes Aqui.',
        };
    }

    if (pathname.startsWith('/questaopublica/')) {
        return {
            title: 'Questao Publica | Questoes Aqui',
            description: 'Visualize uma questao publica do Questoes Aqui.',
        };
    }

    return {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
    };
}

function getCanonicalPath(pathname) {
    if (pathname.startsWith('/listagemprovas/')) {
        return pathname;
    }

    if (pathname.startsWith('/listagemquestoes/')) {
        return pathname;
    }

    if (pathname.startsWith('/questaopublica/')) {
        return pathname;
    }

    return SEO_BY_PATH[pathname] ? pathname : '/';
}

function Seo() {
    const { pathname } = useLocation();

    useEffect(() => {
        const seo = getSeoForPath(pathname);
        const canonicalPath = getCanonicalPath(pathname);
        const robotsContent = NOINDEX_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
            ? 'noindex, nofollow'
            : 'index, follow';

        document.title = seo.title;

        upsertMeta(
            'meta[name="description"]',
            () => {
                const element = document.createElement('meta');
                element.setAttribute('name', 'description');
                return element;
            },
            (element) => element.setAttribute('content', seo.description),
        );

        upsertMeta(
            'meta[name="robots"]',
            () => {
                const element = document.createElement('meta');
                element.setAttribute('name', 'robots');
                return element;
            },
            (element) => element.setAttribute('content', robotsContent),
        );

        upsertMeta(
            'link[rel="canonical"]',
            () => {
                const element = document.createElement('link');
                element.setAttribute('rel', 'canonical');
                return element;
            },
            (element) => element.setAttribute('href', `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`),
        );
    }, [pathname]);

    return null;
}

export default Seo;
