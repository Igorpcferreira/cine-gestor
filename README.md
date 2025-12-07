
# 🎬 CineGestor

Sistema web para **gestão administrativa de cinema**, desenvolvido como atividade prática da disciplina **Desenvolvimento Web Frontend**.

O sistema permite o **cadastro de filmes, salas, sessões e a venda de ingressos**, seguindo os requisitos funcionais e técnicos definidos no enunciado da atividade.

---

## 📌 Tecnologias Utilizadas

- ⚛️ **React** + **Vite**
- 🟦 **TypeScript**
- 🎨 **Bootstrap 5**
- 🧪 **Zod** (validação de formulários)
- 🚏 **React Router DOM**
- 🗄️ **json-server** (API REST simulada)
- 🎯 **Bootstrap Icons**

---

## 🗂️ Estrutura do Projeto

```
src/
├─ layouts/
│  └─ MainLayout.tsx
├─ pages/
│  ├─ HomePage.tsx
│  ├─ filmes/
│  │  └─ FilmesPage.tsx
│  ├─ salas/
│  │  └─ SalasPage.tsx
│  ├─ sessoes/
│  │  └─ SessoesPage.tsx
│  └─ ingressos/
│     └─ VenderIngressoPage.tsx
├─ schemas/
│  ├─ filmeSchema.ts
│  ├─ salaSchema.ts
│  ├─ sessaoSchema.ts
│  └─ ingressoSchema.ts
├─ services/
│  ├─ api.ts
│  ├─ filmesService.ts
│  ├─ salasService.ts
│  ├─ sessoesService.ts
│  └─ ingressosService.ts
├─ types/
│  ├─ filme.ts
│  ├─ sala.ts
│  ├─ sessao.ts
│  └─ ingresso.ts
└─ main.tsx
```

---

## ⚙️ Configuração do Backend (json-server)

O projeto utiliza **json-server** para simular uma API REST.

### 📄 Estrutura do `db.json`:

```json
{
  "filmes": [],
  "salas": [],
  "sessoes": [],
  "ingressos": []
}
```

### ▶️ Iniciar o backend:

```bash
npx json-server --watch db.json --port 3000
```

---

## ▶️ Como Rodar o Projeto

### 1️⃣ Instalar dependências
```bash
npm install
```

### 2️⃣ Iniciar o backend
```bash
npm run server
```

### 3️⃣ Iniciar o frontend
```bash
npm run dev
```

A aplicação ficará disponível em:

```
http://localhost:5173
```

---

## 📋 Funcionalidades Implementadas

### ✅ Módulo de Filmes
- Cadastro de filmes
- Listagem de filmes
- Exclusão
- Validação com Zod

### ✅ Módulo de Salas
- Cadastro de salas
- Validação de número e capacidade

### ✅ Módulo de Sessões
- Agendamento de sessões
- Seleção de filme e sala
- Definição de data e horário
- Listagem cruzando dados (Filme + Sala)
- Exclusão de sessões

### ✅ Venda de Ingressos
- Botão **Vender Ingresso** por sessão
- Venda de ingresso do tipo **Inteira** ou **Meia**
- Cálculo automático do valor final
- Associação do ingresso à sessão
- Listagem de ingressos vendidos por sessão

---

## ✅ Validações (Zod)

- Filmes:
    - Título obrigatório
    - Sinopse com mínimo de 10 caracteres
    - Duração positiva
- Sessões:
    - Obrigatório selecionar filme e sala
    - Data/hora obrigatória
- Ingressos:
    - Valor base obrigatório
    - Tipo de ingresso obrigatório

---

## 📱 Interface (UI/UX)

- Layout responsivo com **Bootstrap Grid**
- Feedback visual para erros de formulário
- Uso de **Bootstrap Icons** para ações
- Navegação SPA com **React Router**

---

## 👨‍💻 Autor

Projeto desenvolvido por **Igor Ferreira**  
Disciplina: Desenvolvimento Web Frontend  
Curso: Ciência da Computação
