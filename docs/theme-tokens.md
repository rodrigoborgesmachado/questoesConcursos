# Theme Tokens (Etapa 1)

Este documento registra os tokens globais usados no frontend para padronizar dark/light.

## Arquivo fonte

- `src/index.css`

## Tokens adicionados nesta etapa

- `--modal-surface-color`
- `--input-background-color`
- `--input-border-color`
- `--input-text-color`
- `--input-placeholder-color`
- `--progress-track-color`
- `--progress-bar-color`
- `--pagination-item-color`
- `--chart-highlight-color`

## Pontos convertidos para variavel

- Background de modais ReactModal (`customStyles` e `customStylesQuestoes`)
- Barras de progresso (Historico Usuario, Perfil, Resultado Simulado)
- Cores de paginação MUI (Historico Usuario, Cadastro Avaliacao, Listagem Avaliacoes)
- Inputs globais (`.login input` e `.global-input`)

## Excecoes intencionais

- `#000` em `src/components/PacmanLoader/PacmanLoader.css`:
  usado como mascara no gradiente do loader (nao e cor visual do tema).
