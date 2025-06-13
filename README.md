# Sistema de Gestão de Cobranças - Next.js + TypeScript

Um sistema completo de gestão de cobranças desenvolvido com Next.js, TypeScript, Tailwind CSS e Shadcn/UI.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes UI modernos e acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Lucide React** - Ícones modernos

## 📋 Funcionalidades

### 🔐 Autenticação
- Login com validação completa
- Recuperação de senha
- Proteção de rotas com middleware
- Contexto de autenticação global

### 📊 Dashboard
- Cards de métricas financeiras
- Dados organizados por período de vencimento
- Interface responsiva
- Atualização em tempo real

### 💰 Gestão de Cobranças
- Tabela de documentos a receber
- Seleção múltipla para ações em massa
- Envio de mensagens (E-mail, WhatsApp, SMS)
- Filtros e busca
- Status visuais com badges

### 🎯 Gestão PIX
- Gerenciamento de chaves PIX
- Histórico de transações
- Geração de QR Codes
- Status de chaves (Ativa/Inativa)

### ⚙️ Configurações
- Períodos de envio automático
- Templates de mensagens personalizáveis
- Configuração de contas de envio
- Variáveis dinâmicas para templates

### 👤 Minha Conta
- Dados pessoais editáveis
- Dados da empresa
- Upload de avatar
- Alteração de senha segura
- Gerenciamento de sessões

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd sistema-cobrancas-nextjs

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### Acesso
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Credenciais de Teste
- **CNPJ**: 12.345.678/0001-90
- **E-mail**: admin@empresa.com
- **Senha**: 123456