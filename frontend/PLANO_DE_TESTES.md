# Plano de Testes — TrainEasy

## 1. Visão Geral

Este documento descreve o plano de testes para o aplicativo **TrainEasy**, cobrindo as funcionalidades de **Cadastro**, **Login**, **Atualização de Conta**, **Exclusão de Conta** e **Logout**.

---

## 2. Escopo dos Testes

| Módulo            | Tipo de Teste      | Camada             |
|-------------------|--------------------|--------------------|
| Cadastro (Registro)| Unitário          | Frontend (Service) |
| Login             | Unitário           | Frontend (Service) |
| Leitura de Usuário| Unitário           | Frontend (Service) |
| Atualização       | Unitário           | Frontend (Service) |
| Exclusão          | Unitário           | Frontend (Service) |
| Armazenamento     | Unitário           | Frontend (Storage) |

---

## 3. Casos de Teste

### 3.1 Cadastro (Registro)

| ID    | Cenário                                  | Entrada                                           | Resultado Esperado                         |
|-------|------------------------------------------|----------------------------------------------------|--------------------------------------------|
| CT-01 | Registro com dados válidos               | nome: "João", email: "joao@email.com", senha: "123456" | success: true, user retornado             |
| CT-02 | Registro com email já existente          | email duplicado                                    | success: false, mensagem de erro           |
| CT-03 | Registro com servidor indisponível       | qualquer dado válido                               | success: false, "Não foi possível conectar"|

### 3.2 Login

| ID    | Cenário                                  | Entrada                                           | Resultado Esperado                         |
|-------|------------------------------------------|----------------------------------------------------|--------------------------------------------|
| CT-04 | Login com credenciais válidas            | email: "joao@email.com", senha: "123456"           | success: true, user retornado              |
| CT-05 | Login com email inexistente              | email: "naoexiste@email.com"                       | success: false, mensagem de erro           |
| CT-06 | Login com senha incorreta                | email válido, senha errada                         | success: false, mensagem de erro           |
| CT-07 | Login com servidor indisponível          | qualquer dado                                      | success: false, "Não foi possível conectar"|

### 3.3 Leitura de Dados do Usuário

| ID    | Cenário                                  | Entrada                                           | Resultado Esperado                         |
|-------|------------------------------------------|----------------------------------------------------|--------------------------------------------|
| CT-08 | Buscar usuário com ID válido             | id: 1                                              | success: true, dados do usuário            |
| CT-09 | Buscar usuário com ID inexistente        | id: 999                                            | success: false, mensagem de erro           |

### 3.4 Atualização de Conta

| ID    | Cenário                                  | Entrada                                           | Resultado Esperado                         |
|-------|------------------------------------------|----------------------------------------------------|--------------------------------------------|
| CT-10 | Atualizar nome com sucesso               | id: 1, nome: "João Atualizado"                     | success: true, nome atualizado             |
| CT-11 | Atualizar email com sucesso              | id: 1, email: "novo@email.com"                     | success: true, email atualizado            |
| CT-12 | Atualizar email para um já existente     | id: 1, email de outro usuário                      | success: false, mensagem de erro           |
| CT-13 | Atualizar senha com sucesso              | id: 1, senha: "novasenha123"                       | success: true                              |
| CT-14 | Atualizar com servidor indisponível      | qualquer dado                                      | success: false, "Não foi possível conectar"|

### 3.5 Exclusão de Conta

| ID    | Cenário                                  | Entrada                                           | Resultado Esperado                         |
|-------|------------------------------------------|----------------------------------------------------|--------------------------------------------|
| CT-15 | Excluir conta com sucesso                | id: 1                                              | success: true, "Conta excluída"            |
| CT-16 | Excluir conta de usuário inexistente     | id: 999                                            | success: false, mensagem de erro           |
| CT-17 | Excluir com servidor indisponível        | qualquer id                                        | success: false, "Não foi possível conectar"|

### 3.6 Armazenamento Local (Storage)

| ID    | Cenário                                  | Entrada                                           | Resultado Esperado                         |
|-------|------------------------------------------|----------------------------------------------------|--------------------------------------------|
| CT-18 | Salvar dados do usuário                  | user: {id, nome, email}                            | AsyncStorage.setItem chamado               |
| CT-19 | Recuperar dados existentes               | dados previamente salvos                           | retorna objeto do usuário                  |
| CT-20 | Recuperar quando não há dados            | storage vazio                                      | retorna null                               |
| CT-21 | Limpar dados do usuário (logout)         | -                                                  | AsyncStorage.removeItem chamado            |

---

## 4. Como Executar os Testes

```bash
cd frontend
npx jest
```

Para rodar em modo watch:
```bash
npx jest --watch
```

Para ver cobertura:
```bash
npx jest --coverage
```

---

## 5. Arquivos de Teste

| Arquivo                              | Módulos Testados                     |
|--------------------------------------|--------------------------------------|
| `src/__tests__/authService.test.ts`  | registerUser, loginUser              |
| `src/__tests__/userService.test.ts`  | getUser, updateUser, deleteUser      |
| `src/__tests__/storage.test.ts`      | saveUser, getStoredUser, clearUser   |

---

## 6. Ferramentas Utilizadas

- **Jest** — Framework de testes JavaScript/TypeScript
- **ts-jest** — Transformador TypeScript para Jest
- **@testing-library/react-native** — Utilitários de teste para React Native
- **Mocks** — API e AsyncStorage mockados para isolamento

---

## 7. Critérios de Aceitação

- Todos os 21 casos de teste devem passar ✅
- Nenhum teste deve depender de servidor externo (totalmente mockado)
- Testes devem executar em menos de 10 segundos
