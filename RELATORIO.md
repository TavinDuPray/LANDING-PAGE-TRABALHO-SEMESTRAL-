# Relatório Prático — Projeto de Marketing Digital

**Instituto Superior do Litoral do Paraná – ISULPAR**
Curso: Sistemas de Informação – 5º Período
Disciplina: Marketing Digital
Professor: Luiz Carlos Efigenio da Rosa Junior
Data de entrega: 18/06/2026

---

## 1. Introdução do Projeto

### 1.1. Nome da marca / produto
**FitManager** — *Sistema de gestão completo para personal trainers.*

O slogan de posicionamento é: **"Gerencie seus alunos e multiplique sua renda como personal trainer."**

### 1.2. Categoria sorteada
**SaaS (Software as a Service)** — software disponibilizado como serviço, acessado pelo navegador, sem necessidade de instalação, com modelo de receita por assinatura mensal recorrente.

### 1.3. Objetivo do projeto
Desenvolver um produto digital real (SaaS) que resolva uma dor concreta de um público específico — o personal trainer autônomo — e construir toda a estratégia de marketing digital em torno dele: posicionamento, persona, copywriting, funil de vendas, SEO, landing page de conversão e definição de métricas (KPIs).

O FitManager centraliza, em um único painel, as três tarefas que mais consomem tempo e geram perdas financeiras para o personal trainer:
1. **Gestão de alunos** (cadastro, objetivos, avaliação física, evolução);
2. **Prescrição de treinos** com fotos e vídeos demonstrativos dos exercícios;
3. **Controle de pagamentos** (mensalidades, inadimplência e receita).

A referência de mercado utilizada como inspiração foi o **MFit Personal** (mfitpersonal.com.br).

---

## 2. Desenvolvimento

### 2.1. Tecnologias utilizadas e justificativa

| Tecnologia | Onde foi usada | Justificativa |
|---|---|---|
| **HTML5** | Estrutura da landing page e do app | Padrão universal, semântico e essencial para SEO. |
| **CSS3** (variáveis, Flexbox, Grid) | Identidade visual e responsividade | Permite criar um design system consistente (cores da marca em variáveis CSS), layout responsivo sem frameworks pesados. |
| **JavaScript (puro / Vanilla JS)** | Lógica do app (SPA) e interações | Sem dependências externas, garante que o sistema funcione apenas abrindo o arquivo no navegador — confiabilidade máxima no dia da apresentação. |
| **localStorage** | Banco de dados do app | Persiste os dados (alunos, treinos, pagamentos) no próprio navegador, simulando um back-end sem precisar de servidor ou internet. |
| **Google Fonts (Poppins)** | Tipografia | Fonte moderna e legível que reforça a identidade jovem e tecnológica da marca. |
| **Schema.org / JSON-LD** | SEO técnico | Dados estruturados que ajudam o Google a entender que o produto é um software. |
| **YouTube Embed** | Vídeos dos exercícios | Reaproveita a maior base de vídeos do mundo sem custo de hospedagem de mídia. |

**Por que não usamos React/Angular ou um back-end real?** Para um SaaS em estágio de validação (MVP) e para garantir **execução sem falhas na apresentação**, optou-se por uma stack leve que não exige build, instalação de dependências nem conexão com servidor. A arquitetura, no entanto, foi pensada para migrar facilmente para um back-end real (a camada de dados está isolada no arquivo `data.js`).

### 2.2. Público-alvo
- **Profissão:** Personal trainers autônomos e estúdios de treinamento de pequeno/médio porte.
- **Idade:** 24 a 45 anos.
- **Localização:** Centros urbanos do Brasil.
- **Comportamento:** Profissionais que atendem entre 10 e 60 alunos, usam WhatsApp e planilhas para gerenciar o negócio, têm domínio básico de tecnologia e desejam profissionalizar o atendimento e aumentar a renda.
- **Renda:** Classe B/C, com faturamento mensal entre R$ 3.000 e R$ 15.000.

### 2.3. Persona

> **Camila Andrade, 29 anos — Personal Trainer autônoma (Curitiba/PR)**
>
> Atende 35 alunos, parte em academia e parte a domicílio. Ama treinar pessoas, mas perde **8 horas por semana** montando planilhas, cobrando mensalidade no WhatsApp e reenviando os mesmos vídeos de exercício. Sofre com **inadimplência** porque não tem controle de quem pagou. Quer **crescer, profissionalizar o atendimento e parar de perder dinheiro.**
>
> **Dores:** cobrança manual, inadimplência, treinos desorganizados no WhatsApp, falta de tempo, dificuldade de escalar.
> **Desejos:** uma ferramenta simples, profissional e bonita que centralize tudo e a faça parecer mais profissional para os clientes.
> **Objeções:** "será que é difícil de usar?", "será que é caro?", "meus alunos vão conseguir usar?".

A landing page foi construída respondendo diretamente a essas dores, desejos e objeções.

### 2.4. Estratégias de marketing aplicadas

- **Posicionamento digital:** o FitManager se posiciona não como "mais um app de treino", mas como o **sistema que aumenta a renda do personal** — foco no resultado de negócio, não na funcionalidade.
- **Marketing de conteúdo:** previsão de blog com temas como "como reduzir inadimplência", "como precificar seus serviços", "como fidelizar alunos" — atraindo a persona via SEO orgânico (topo de funil).
- **Redes sociais:** Instagram e YouTube como canais principais (onde os personais já estão), com Reels de "antes e depois" de organização e depoimentos.
- **Prova social:** depoimentos, número de usuários ("+2.000 personais"), avaliação média (4,9★) e logos de academias conhecidas na landing page.
- **Gatilhos mentais (persuasão):** escassez/urgência ("teste grátis de 14 dias"), prova social, autoridade, reciprocidade (plano gratuito) e ancoragem de preço (3 planos, com o do meio destacado).
- **Relacionamento com o cliente:** onboarding simples (3 passos), plano gratuito de entrada e suporte — estratégia de retenção e redução de churn.

### 2.5. Estratégias de venda (modelo de negócio)

- **Modelo:** SaaS por assinatura recorrente (receita previsível — MRR).
- **Freemium:** plano gratuito (até 5 alunos) como porta de entrada e geração de leads.
- **Trial:** 14 dias grátis do plano pago, sem cartão, reduzindo o atrito da decisão.
- **Planos escalonados (3 tiers):**
  | Plano | Preço | Alvo |
  |---|---|---|
  | Iniciante | Grátis | Quem está começando (até 5 alunos) |
  | **Profissional** | **R$ 49,90/mês** | **Personal autônomo (plano âncora, mais popular)** |
  | Studio | R$ 129/mês | Equipes e academias (até 5 personais) |
- **Estratégia de upgrade:** conforme a carteira de alunos cresce, o personal naturalmente migra do gratuito para o pago (limite de 5 alunos no plano free).

### 2.6. Técnicas de SEO utilizadas

**SEO On-page / técnico (implementado na landing page):**
- Tag `<title>` otimizada com palavras-chave: *"Sistema de Gestão para Personal Trainer | Treinos, Alunos e Pagamentos"*.
- `meta description` persuasiva e dentro do limite de caracteres.
- `meta keywords`, `author`, `robots` (index, follow) e `canonical`.
- **Open Graph** e **Twitter Cards** para compartilhamento otimizado em redes sociais.
- **Dados estruturados (JSON-LD / Schema.org)** do tipo `SoftwareApplication`, com preço e avaliação.
- Hierarquia correta de headings (`H1` único, `H2`/`H3` nas seções).
- HTML semântico (`header`, `section`, `footer`, `nav`).
- Atributos `alt` em imagens e `aria-label` em botões (acessibilidade + SEO).
- `lang="pt-BR"` e performance (preconnect de fontes).

**Palavras-chave-alvo:** *software para personal trainer, app de gestão de alunos, controle de mensalidade academia, ficha de treino online, app de treino com vídeo.*

### 2.7. Estrutura da landing page

A página segue a estrutura clássica de uma landing page de alta conversão, na ordem do funil:

1. **Header fixo** com navegação e CTAs sempre visíveis ("Entrar" e "Testar grátis").
2. **Hero** — promessa principal (headline com benefício), subtítulo com a dor, dois CTAs e prova social numérica + mockup do produto.
3. **Barra de logos** — prova social / autoridade.
4. **Recursos** — 6 funcionalidades com ícones (transformando features em benefícios).
5. **Como funciona** — 3 passos (reduz a objeção "é complicado").
6. **Persona** — apresentação da Camila (identificação do visitante).
7. **Planos (Pricing)** — 3 tiers com o plano do meio destacado (ancoragem).
8. **Depoimentos** — prova social qualitativa com resultados (★★★★★).
9. **FAQ** — quebra de objeções (instalação, segurança/LGPD, cancelamento, trial).
10. **CTA final** — última chamada para conversão.
11. **Footer** — links institucionais, redes sociais e informações legais.

### 2.8. Estratégias de conversão (CRO)

- **CTAs repetidos e contrastantes** (botão verde-limão sobre fundo escuro) em todas as dobras.
- **Redução de atrito:** "grátis", "sem cartão", "cancele quando quiser".
- **Hierarquia visual** que conduz o olhar até o botão.
- **Plano âncora** ("Mais Popular") destacado para direcionar a escolha.
- **FAQ** posicionado antes do CTA final para eliminar objeções no momento da decisão.
- **Mockup do produto** no hero (mostra o produto real, gera confiança).
- **Microinterações** (animações de revelação ao rolar, hover nos cards) que aumentam o engajamento.

### 2.9. Ferramentas utilizadas
- **Editor de código / desenvolvimento:** VS Code + Claude Code.
- **Linguagens:** HTML, CSS, JavaScript.
- **Tipografia:** Google Fonts.
- **Mídia:** YouTube (vídeos dos exercícios) e Unsplash (imagens).
- **Hospedagem (sugerida):** GitHub Pages / Netlify / Vercel (gratuitas).
- **Design / identidade:** paleta e protótipo definidos diretamente em CSS (design system com variáveis).

### 2.10. Estrutura do aplicativo (SaaS)
O app (`app.html`) é uma aplicação de página única com login simulado e 5 módulos:
1. **Painel (Dashboard):** receita do mês, alunos ativos, pendências, inadimplência e gráfico de receita dos últimos 6 meses.
2. **Alunos:** CRUD completo, busca e filtros, ficha individual com avaliação física (peso, IMC, % de gordura), treino atribuído e histórico de pagamentos.
3. **Treinos:** criação de fichas, adição de exercícios com séries/repetições/descanso/observação e atribuição a alunos.
4. **Exercícios:** biblioteca com 12 exercícios, fotos e vídeos demonstrativos (modal de vídeo do YouTube).
5. **Pagamentos:** controle de mensalidades por mês/status, marcar como pago, registrar cobrança e resumo financeiro.

### 2.11. Dificuldades encontradas
- Garantir que o sistema funcionasse **sem servidor e sem internet** — resolvido com `localStorage` como banco de dados local.
- Criar persistência de dados confiável e dados de exemplo (seed) realistas para a demonstração.
- Equilibrar um design moderno e profissional com **responsividade** total (desktop e celular) usando apenas CSS.
- Integração de vídeos sem custo de hospedagem — resolvido com embeds do YouTube e link de fallback de busca.

### 2.12. Melhorias futuras
- Back-end real (Node.js + banco de dados) e autenticação segura.
- **Aplicativo do aluno** (acesso aos treinos pelo celular e marcação de treinos concluídos).
- Integração de **pagamento real** (Pix, cartão, gateway como Stripe/Mercado Pago) com cobrança automática.
- Notificações automáticas de vencimento por WhatsApp/e-mail.
- Relatórios avançados e exportação (PDF).
- Gráficos de evolução física do aluno.

---

## 3. Resultados Esperados

### 3.1. Como o produto poderia gerar vendas / conversão
- **Aquisição (topo do funil):** conteúdo de blog otimizado para SEO + Instagram/YouTube atraem o personal trainer que busca se organizar.
- **Ativação:** o plano **gratuito** e o **trial de 14 dias** removem o risco e permitem que o usuário experimente o valor antes de pagar.
- **Conversão:** ao atingir o limite de 5 alunos (plano free), o personal converte para o plano Profissional (R$ 49,90/mês).
- **Receita recorrente (MRR):** o modelo de assinatura gera receita previsível e crescente.
- **Expansão:** estúdios e academias migram para o plano Studio (R$ 129/mês).
- **Retenção:** quanto mais o personal cadastra alunos e treinos, maior o custo de troca (lock-in saudável), reduzindo o churn.

### 3.2. Possíveis métricas e KPIs

**Marketing (funil):**
- Visitantes únicos na landing page;
- Taxa de conversão da landing page (visitantes → cadastros) — meta inicial ~3% a 5%;
- CAC (Custo de Aquisição de Cliente);
- Origem do tráfego (orgânico, social, pago).

**Produto / Negócio (SaaS):**
- **MRR** (Receita Recorrente Mensal) e **ARR** (anual);
- **Taxa de conversão trial → pago** (meta ~15% a 25%);
- **Churn** (taxa de cancelamento mensal) — meta < 5%;
- **LTV** (Valor do Tempo de Vida do Cliente) e relação **LTV/CAC** (saudável ≥ 3);
- **Ativação:** % de usuários que cadastram o 1º aluno/treino;
- **NPS** (satisfação dos usuários).

**Métricas que o próprio produto entrega ao personal (valor percebido):**
- Receita mensal, taxa de inadimplência, nº de alunos ativos e evolução da receita — exibidas no Painel.

---

## 4. Conclusão

O FitManager demonstra a aplicação integrada dos conceitos de Marketing Digital sobre um produto SaaS real: partindo da identificação de uma dor concreta de um público específico (o personal trainer), construímos persona, posicionamento, copywriting, uma landing page de conversão com SEO e um funil de vendas freemium com métricas claras. O resultado é um produto digital funcional acompanhado de uma estratégia de marketing coerente, do primeiro clique até a receita recorrente.

---

*Projeto acadêmico — ISULPAR · Sistemas de Informação · Marketing Digital · 2026*
