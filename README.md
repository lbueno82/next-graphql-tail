
# NEXT & GRAPHQL & TAILWIND

### Technologies Used:

- TypeScript
- Next.js
- GraphQL Nexus
- Apollo Server
- Tailwindcss


> Para acesso as chaves de configuração criar o arquivo .env a partir do arquivo de exemplo .env.example

> Ou fazer uso da ferramenta infisical seguindo as orientações do link [Guia NExts.js + Vercel](https://infisical.com/docs/documentation/guides/nextjs-vercel)


Projeto configurado para multi-tenant, baseado em schema para separar dados dos clientes, __*em um versão futura teremos a separação por banco de dados*__.

### Getting Started

First, run the development server:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) com seu navegador para ver o resultado.

Este projeto usa [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) para otimizar e carregar automaticamente o Inter, uma fonte personalizada do Google.


## Deploy on Vercel

A maneira mais fácil de implementar seu aplicativo Next.js é usar a Plataforma Vercel dos criadores do Next.js.

Confira [a documentação](https://nextjs.org/docs/deployment) de implementação do Next.js para mais detalhes.

### Storages
Projeto configurado para uso dos recursos da Vercel
- Banco Postgress
- Redis - Vercel KV.

