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

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── cobrancas/         # Página de cobranças
│   ├── configuracao/      # Página de configuração
│   ├── dashboard/         # Dashboard principal
│   ├── gestao-pix/        # Gestão PIX
│   ├── login/             # Página de login
│   ├── minha-conta/       # Página da conta do usuário
│   └── reset-password/    # Recuperação de senha
├── components/            # Componentes React
│   ├── ui/               # Componentes Shadcn/UI
│   ├── DashboardLayout.tsx
│   └── ProtectedRoute.tsx
├── contexts/             # Contextos React
│   └── AuthContext.tsx
├── data/                 # Dados mockados
│   └── mockData.ts
├── types/                # Tipos TypeScript
│   └── index.ts
└── middleware.ts         # Middleware do Next.js
```

## 🎨 Design System

### Cores
- **Primária**: Azul (#3B82F6)
- **Secundária**: Cinza (#6B7280)
- **Sucesso**: Verde (#10B981)
- **Aviso**: Amarelo (#F59E0B)
- **Erro**: Vermelho (#EF4444)

### Componentes
Todos os componentes seguem o padrão Shadcn/UI com:
- Acessibilidade completa
- Variantes de tamanho e cor
- Estados de hover e focus
- Animações suaves

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_APP_NAME="Sistema de Gestão de Cobranças"
```

### Customização
- **Cores**: Edite `tailwind.config.js`
- **Componentes**: Modifique arquivos em `src/components/ui/`
- **Dados**: Atualize `src/data/mockData.ts`

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testes

### Funcionalidades Testadas
- ✅ Login e logout
- ✅ Navegação entre páginas
- ✅ Seleção múltipla
- ✅ Envio em massa
- ✅ Modais de confirmação
- ✅ Formulários de configuração
- ✅ Upload de avatar
- ✅ Alteração de senha

### Como Testar
1. Execute `npm run dev`
2. Acesse http://localhost:3000
3. Faça login com as credenciais de teste
4. Navegue pelas páginas e teste as funcionalidades

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Build Local
```bash
npm run build
npm start
```

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do e-mail: suporte@empresa.com

---

Desenvolvido com ❤️ usando Next.js + TypeScript

