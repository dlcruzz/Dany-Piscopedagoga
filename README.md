# Nexus Psicopedagogia — Site Institucional

Landing page institucional desenvolvida para a **Nexus Psicopedagogia**, clínica de psicopedagogia clínica e institucional em São Paulo/SP. Site estático, responsivo e visualmente rico, com foco em apresentar o trabalho da profissional e converter visitantes em agendamentos via WhatsApp e Instagram.

> Projeto desenvolvido como trabalho **freelancer** de desenvolvimento web (crédito de rodapé: Zinkra Tecnologia).

## Sobre o projeto

O site foi construído do zero em HTML/CSS/JS puro (sem frameworks, sem build step), priorizando performance, identidade visual autoral e uma experiência de rolagem rica em animações que reforçam a marca — incluindo um elemento 3D interativo no Hero e pequenos "desenhos à lápis" que se traçam sozinhos conforme a página é rolada.

## Tecnologias

- **HTML5 + CSS3 + JavaScript** (vanilla, sem dependências de build)
- **Three.js**, auto-hospedado em `assets/three.min.js` (não depende de CDN externo)
- **Google Fonts**: Fraunces (display), Instrument Sans (texto), Caveat (assinatura)
- Dados estruturados **JSON-LD** (`ProfessionalService` + `FAQPage`) para SEO

## Funcionalidades

- Preloader de entrada com a logo real da marca
- Modo escuro (alterna toda a paleta, inclusive as cores do elemento 3D)
- Elemento 3D animado no Hero (Three.js), reage ao mouse e ao tema
- Barra de progresso de rolagem + botão "voltar ao topo" com anel de progresso
- Botões magnéticos nos CTAs principais
- Carrossel de depoimentos com autoplay e loop contínuo (sem "voltar" ao trocar de volta pro primeiro)
- Timeline animada na seção "Como funciona", preenchida conforme a rolagem
- Faixa (marquee) em loop infinito sem cortes
- Galeria de fotos em carrossel grande, com autoplay, zoom lento ("Ken Burns") e 3 animações de transição estilo "lápis riscando" que alternam a cada troca
- Seção Instagram com link direto para o perfil real
- ~19 desenhos decorativos ("doodles") que se desenham sozinhos ao entrar na tela, em loop contínuo, espalhados por todas as seções
- Cards com tilt 3D ao passar o mouse, glow ambiente seguindo o cursor, parallax de fundo
- Página separada de Termos de Uso
- SEO avançado: Open Graph, Twitter Card, canonical, `robots.txt`, `sitemap.xml`, `manifest.json` e favicon próprio
- Acessível: skip-link, hierarquia de headings corrigida, respeita `prefers-reduced-motion` em todas as animações

## Estrutura de arquivos

```
daniely-site/
├── index.html            # página principal
├── termos-de-uso.html    # termos de uso / direitos reservados
├── style.css             # todo o CSS do site
├── script.js             # toda a interatividade (vanilla JS)
├── manifest.json         # PWA / ícones
├── robots.txt
├── sitemap.xml
├── LEIA-ME.txt           # checklist de pendências para o cliente (pt-BR)
└── assets/
    ├── three.min.js       # Three.js auto-hospedado
    ├── nexus-icon.png     # ícone da marca (nav, preloader, favicons)
    ├── nexus-logo.png     # logo completa (ícone + wordmark)
    ├── favicon-*.png      # favicons em vários tamanhos
    ├── og-image.jpg       # imagem de compartilhamento (redes sociais)
    └── gallery-*.jpg      # fotos da galeria
```

## Como rodar localmente

Não precisa de servidor nem instalação — é só abrir `index.html` direto no navegador.

## Deploy

Suba os arquivos e a pasta `assets/` inteira para qualquer hospedagem estática (Hostinger, Vercel, Netlify, GitHub Pages etc.) junto com o domínio.

## Pendências antes de publicar

O arquivo [`LEIA-ME.txt`](LEIA-ME.txt) tem o checklist completo (em português, escrito para o cliente) do que ainda precisa ser trocado antes de colocar o site no ar: número de WhatsApp, e-mail, domínio definitivo, depoimentos reais, imagem de compartilhamento e configuração do feed do Instagram.

## Créditos

Desenvolvido como projeto freelancer de desenvolvimento web.
