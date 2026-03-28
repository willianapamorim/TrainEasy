# PLANO DE TESTES — TRAINEASY

## Informações do Documento

| Campo                   | Descrição                                                          |
| ----------------------- | ------------------------------------------------------------------ |
| **Projeto**             | TrainEasy — Aplicativo Mobile de Gerenciamento de Treinos          |
| **Versão do Documento** | 2.0                                                                |
| **Data de Elaboração**  | 18 de março de 2026                                                |
| **Tipo de Documento**   | Plano de Testes de Software                                        |
| **Tecnologias**         | React Native (Expo) · TypeScript · Spring Boot · Java · PostgreSQL |

---

## 1. Introdução

### 1.1 Objetivo

O presente documento tem como objetivo descrever de forma detalhada o plano de testes do sistema **TrainEasy**, contemplando os testes automatizados implementados e as validações programáticas existentes no código-fonte. A documentação visa fornecer rastreabilidade entre as funcionalidades do sistema e os procedimentos de verificação adotados, servindo como artefato formal para o Trabalho de Conclusão de Curso (TCC).

### 1.2 Escopo

O escopo dos testes abrange as seguintes funcionalidades do sistema:

- Cadastro de usuário (registro)
- Autenticação de usuário (login)
- Consulta de dados do usuário
- Atualização de dados do usuário (nome, e-mail, senha)
- Exclusão de conta de usuário
- Armazenamento local de sessão (persistência de dados do usuário no dispositivo)
- Logout (encerramento de sessão)

Os testes cobrem a **camada de serviço do frontend** (testes unitários automatizados com Jest) e as **validações programáticas** embutidas nas camadas de backend (Spring Boot) e frontend (React Native).

### 1.3 Abordagem de Testes

A estratégia de testes adotada combina:

- **Testes unitários automatizados**: implementados com o framework Jest, cobrindo as funções de serviço do frontend de forma isolada, com mocks de dependências externas (API HTTP e AsyncStorage).
- **Validações de entrada (backend)**: implementadas via Bean Validation (Jakarta Validation) nos DTOs do Spring Boot, garantindo a integridade dos dados antes do processamento.
- **Validações de entrada (frontend)**: implementadas nas telas de interface do usuário, com verificação de campos obrigatórios e consistência de dados antes do envio ao servidor.
- **Tratamento de exceções (backend)**: implementado via `GlobalExceptionHandler`, garantindo respostas padronizadas para cenários de erro.

### 1.4 Ambiente de Testes

| Componente         | Tecnologia / Ferramenta                        |
| ------------------ | ---------------------------------------------- |
| Framework de teste | Jest 29.x com preset `jest-expo`               |
| Linguagem          | TypeScript                                     |
| Transpilação       | ts-jest                                        |
| Mocking            | Jest Mocks (API Axios e AsyncStorage mockados) |
| Configuração       | `jest.config.js` com module aliases (`@/`)     |
| Setup global       | `src/__tests__/setup.ts`                       |

---

## 2. Arquitetura dos Testes

### 2.1 Estrutura de Arquivos de Teste

| Arquivo de Teste                    | Módulo Testado                 | Funções Cobertas                               |
| ----------------------------------- | ------------------------------ | ---------------------------------------------- |
| `src/__tests__/authService.test.ts` | Serviço de Autenticação        | `registerUser()`, `loginUser()`                |
| `src/__tests__/userService.test.ts` | Serviço de Usuário             | `getUser()`, `updateUser()`, `deleteUser()`    |
| `src/__tests__/storage.test.ts`     | Serviço de Armazenamento Local | `saveUser()`, `getStoredUser()`, `clearUser()` |
| `src/__tests__/setup.ts`            | Configuração Global de Mocks   | Mock do AsyncStorage e expo-router             |

### 2.2 Estratégia de Isolamento

Todos os testes unitários operam de forma isolada, sem dependência de servidor externo ou banco de dados. O isolamento é garantido por:

- **Mock da API Axios**: a instância `api` (Axios) é completamente mockada, permitindo simular respostas de sucesso e erro da API REST sem realizar chamadas HTTP reais.
- **Mock do AsyncStorage**: o módulo `@react-native-async-storage/async-storage` é mockado para simular operações de persistência local.
- **Mock do expo-router**: os hooks de navegação (`useRouter`) são mockados para evitar dependências de contexto de navegação.
- **Limpeza entre testes**: `jest.clearAllMocks()` é executado antes de cada caso de teste via `beforeEach`, garantindo que não haja interferência entre execuções.

---

## 3. Casos de Teste Automatizados

### 3.1 Módulo: Autenticação — Registro de Usuário

**Arquivo de teste:** `src/__tests__/authService.test.ts`
**Função sob teste:** `registerUser()` — `src/services/authService.ts`
**Tipo de teste:** Unitário

| ID    | Cenário de Teste                   | Objetivo                                                                                          | Procedimento Executado                                                                                                                                                                                | Resultado Esperado                                                                                                     | Resultado Obtido                                                        |
| ----- | ---------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| CT-01 | Registro com dados válidos         | Verificar que o sistema registra um novo usuário corretamente quando dados válidos são fornecidos | 1. Mockar `api.post` para retornar resposta de sucesso com dados do usuário. 2. Chamar `registerUser()` com nome "João", email "joao@email.com" e senha "123456". 3. Verificar a chamada e o retorno. | `api.post` chamado com endpoint `/auth/register` e payload correto; retorno com `success: true` e `user.nome` = "João" | Aprovado — função retorna objeto de sucesso corretamente                |
| CT-02 | Registro com e-mail já cadastrado  | Verificar que o sistema rejeita registro duplicado e retorna erro tratado                         | 1. Mockar `api.post` para rejeitar com AxiosError contendo resposta de conflito ("Email já cadastrado"). 2. Chamar `registerUser()` com e-mail duplicado. 3. Verificar retorno.                       | Retorno com `success: false`                                                                                           | Aprovado — erro da API é interceptado e retornado como `success: false` |
| CT-03 | Registro com servidor indisponível | Verificar o tratamento de erros de conexão quando o servidor não responde                         | 1. Mockar `api.post` para rejeitar com `Error("Network Error")`. 2. Chamar `registerUser()`. 3. Verificar mensagem de retorno.                                                                        | Retorno com `success: false` e `message` = "Não foi possível conectar ao servidor."                                    | Aprovado — erro de rede é tratado com mensagem amigável                 |

---

### 3.2 Módulo: Autenticação — Login de Usuário

**Arquivo de teste:** `src/__tests__/authService.test.ts`
**Função sob teste:** `loginUser()` — `src/services/authService.ts`
**Tipo de teste:** Unitário

| ID    | Cenário de Teste                | Objetivo                                                                               | Procedimento Executado                                                                                                                                                   | Resultado Esperado                                                                                                    | Resultado Obtido                                             |
| ----- | ------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| CT-04 | Login com credenciais válidas   | Verificar que o sistema autentica o usuário corretamente com e-mail e senha válidos    | 1. Mockar `api.post` para retornar resposta de sucesso. 2. Chamar `loginUser()` com email "joao@email.com" e senha "123456". 3. Verificar chamada ao endpoint e retorno. | `api.post` chamado com `/auth/login` e payload correto; retorno com `success: true` e `user.email` = "joao@email.com" | Aprovado — autenticação bem-sucedida com dados corretos      |
| CT-05 | Login com e-mail inexistente    | Verificar que o sistema rejeita login com e-mail não cadastrado e retorna erro tratado | 1. Mockar `api.post` para rejeitar com AxiosError ("Usuário não encontrado"). 2. Chamar `loginUser()` com e-mail inexistente. 3. Verificar retorno.                      | Retorno com `success: false`                                                                                          | Aprovado — erro é interceptado e retornado adequadamente     |
| CT-06 | Login com senha incorreta       | Verificar que o sistema rejeita login com senha errada e retorna erro tratado          | 1. Mockar `api.post` para rejeitar com AxiosError ("Senha incorreta"). 2. Chamar `loginUser()` com senha incorreta. 3. Verificar retorno.                                | Retorno com `success: false`                                                                                          | Aprovado — credenciais inválidas são rejeitadas corretamente |
| CT-07 | Login com servidor indisponível | Verificar o tratamento de erros de conexão durante o login                             | 1. Mockar `api.post` para rejeitar com `Error("Network Error")`. 2. Chamar `loginUser()`. 3. Verificar mensagem de retorno.                                              | Retorno com `success: false` e `message` = "Não foi possível conectar ao servidor."                                   | Aprovado — erro de rede é tratado com mensagem amigável      |

---

### 3.3 Módulo: Gestão de Usuário — Consulta de Dados

**Arquivo de teste:** `src/__tests__/userService.test.ts`
**Função sob teste:** `getUser()` — `src/services/userService.ts`
**Tipo de teste:** Unitário

| ID    | Cenário de Teste                  | Objetivo                                                                           | Procedimento Executado                                                                                                                                              | Resultado Esperado                                                                   | Resultado Obtido                                    |
| ----- | --------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------- |
| CT-08 | Buscar usuário com ID válido      | Verificar que os dados do usuário são retornados corretamente quando o ID existe   | 1. Mockar `api.get` para retornar resposta com dados do usuário (id: 1, nome: "João"). 2. Chamar `getUser(1)`. 3. Verificar chamada ao endpoint e dados retornados. | `api.get` chamado com `/users/1`; retorno com `success: true` e `user.nome` = "João" | Aprovado — dados do usuário retornados corretamente |
| CT-09 | Buscar usuário com ID inexistente | Verificar que o sistema retorna erro ao tentar consultar um usuário que não existe | 1. Mockar `api.get` para rejeitar com `Error("Not found")`. 2. Chamar `getUser(999)`. 3. Verificar retorno.                                                         | Retorno com `success: false`                                                         | Aprovado — erro tratado e retornado como falha      |

---

### 3.4 Módulo: Gestão de Usuário — Atualização de Dados

**Arquivo de teste:** `src/__tests__/userService.test.ts`
**Função sob teste:** `updateUser()` — `src/services/userService.ts`
**Tipo de teste:** Unitário

| ID    | Cenário de Teste                          | Objetivo                                                                                       | Procedimento Executado                                                                                                                                   | Resultado Esperado                                                                                    | Resultado Obtido                                      |
| ----- | ----------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| CT-10 | Atualizar nome do usuário com sucesso     | Verificar que o nome do usuário pode ser atualizado corretamente                               | 1. Mockar `api.put` para retornar sucesso com nome atualizado. 2. Chamar `updateUser(1, { nome: "João Atualizado" })`. 3. Verificar chamada e retorno.   | `api.put` chamado com `/users/1` e payload `{ nome: "João Atualizado" }`; retorno com `success: true` | Aprovado — nome atualizado com sucesso                |
| CT-11 | Atualizar e-mail do usuário com sucesso   | Verificar que o e-mail do usuário pode ser atualizado corretamente                             | 1. Mockar `api.put` para retornar sucesso com e-mail atualizado. 2. Chamar `updateUser(1, { email: "novo@email.com" })`. 3. Verificar retorno.           | Retorno com `success: true` e `user.email` = "novo@email.com"                                         | Aprovado — e-mail atualizado com sucesso              |
| CT-12 | Atualizar e-mail para um já existente     | Verificar que o sistema rejeita a atualização quando o novo e-mail já pertence a outro usuário | 1. Mockar `api.put` para rejeitar com AxiosError ("Email já cadastrado"). 2. Chamar `updateUser(1, { email: "outro@email.com" })`. 3. Verificar retorno. | Retorno com `success: false`                                                                          | Aprovado — duplicidade de e-mail tratada corretamente |
| CT-13 | Atualizar senha do usuário com sucesso    | Verificar que a senha do usuário pode ser atualizada corretamente                              | 1. Mockar `api.put` para retornar sucesso. 2. Chamar `updateUser(1, { senha: "novasenha123" })`. 3. Verificar chamada ao endpoint com payload correto.   | `api.put` chamado com `/users/1` e payload `{ senha: "novasenha123" }`; retorno com `success: true`   | Aprovado — senha atualizada com sucesso               |
| CT-14 | Atualizar dados com servidor indisponível | Verificar o tratamento de erros de conexão durante a atualização                               | 1. Mockar `api.put` para rejeitar com `Error("Network Error")`. 2. Chamar `updateUser(1, { nome: "Teste" })`. 3. Verificar mensagem de retorno.          | Retorno com `success: false` e `message` = "Não foi possível conectar ao servidor."                   | Aprovado — erro de rede tratado com mensagem amigável |

---

### 3.5 Módulo: Gestão de Usuário — Exclusão de Conta

**Arquivo de teste:** `src/__tests__/userService.test.ts`
**Função sob teste:** `deleteUser()` — `src/services/userService.ts`
**Tipo de teste:** Unitário

| ID    | Cenário de Teste                        | Objetivo                                                                         | Procedimento Executado                                                                                                                               | Resultado Esperado                                                                                           | Resultado Obtido                                      |
| ----- | --------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| CT-15 | Excluir conta de usuário com sucesso    | Verificar que a conta do usuário é excluída corretamente                         | 1. Mockar `api.delete` para retornar sucesso ("Conta excluída com sucesso!"). 2. Chamar `deleteUser(1)`. 3. Verificar chamada ao endpoint e retorno. | `api.delete` chamado com `/users/1`; retorno com `success: true` e `message` = "Conta excluída com sucesso!" | Aprovado — conta excluída corretamente                |
| CT-16 | Excluir conta de usuário inexistente    | Verificar que o sistema retorna erro ao tentar excluir um usuário que não existe | 1. Mockar `api.delete` para rejeitar com `Error("Not found")`. 2. Chamar `deleteUser(999)`. 3. Verificar retorno.                                    | Retorno com `success: false`                                                                                 | Aprovado — erro tratado e retornado como falha        |
| CT-17 | Excluir conta com servidor indisponível | Verificar o tratamento de erros de conexão durante a exclusão                    | 1. Mockar `api.delete` para rejeitar com `Error("Network Error")`. 2. Chamar `deleteUser(1)`. 3. Verificar mensagem de retorno.                      | Retorno com `success: false` e `message` = "Não foi possível conectar ao servidor."                          | Aprovado — erro de rede tratado com mensagem amigável |

---

### 3.6 Módulo: Armazenamento Local (Storage)

**Arquivo de teste:** `src/__tests__/storage.test.ts`
**Funções sob teste:** `saveUser()`, `getStoredUser()`, `clearUser()` — `src/services/storage.ts`
**Tipo de teste:** Unitário

| ID    | Cenário de Teste                           | Objetivo                                                                              | Procedimento Executado                                                                                                                                                        | Resultado Esperado                                                                        | Resultado Obtido                                  |
| ----- | ------------------------------------------ | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------- |
| CT-18 | Salvar dados do usuário no dispositivo     | Verificar que os dados do usuário são persistidos corretamente no AsyncStorage        | 1. Chamar `saveUser({ id: 1, nome: "João", email: "joao@email.com" })`. 2. Verificar que `AsyncStorage.setItem` foi chamado com a chave `@traineasy:user` e o JSON do objeto. | `AsyncStorage.setItem` chamado com chave `@traineasy:user` e valor `JSON.stringify(user)` | Aprovado — dados salvos corretamente              |
| CT-19 | Recuperar dados do usuário quando existem  | Verificar que os dados do usuário são recuperados e desserializados corretamente      | 1. Mockar `AsyncStorage.getItem` para retornar JSON do usuário. 2. Chamar `getStoredUser()`. 3. Verificar chave consultada e objeto retornado.                                | `AsyncStorage.getItem` chamado com `@traineasy:user`; retorno igual ao objeto original    | Aprovado — dados recuperados e desserializados    |
| CT-20 | Recuperar dados quando não há dados salvos | Verificar que a função retorna `null` quando não há dados de usuário no armazenamento | 1. Mockar `AsyncStorage.getItem` para retornar `null`. 2. Chamar `getStoredUser()`. 3. Verificar retorno.                                                                     | Retorno `null`                                                                            | Aprovado — ausência de dados tratada corretamente |
| CT-21 | Limpar dados do usuário (logout)           | Verificar que os dados do usuário são removidos do AsyncStorage ao efetuar logout     | 1. Chamar `clearUser()`. 2. Verificar que `AsyncStorage.removeItem` foi chamado com a chave correta.                                                                          | `AsyncStorage.removeItem` chamado com `@traineasy:user`                                   | Aprovado — dados removidos corretamente           |

---

## 4. Validações Programáticas (Backend — Spring Boot)

Além dos testes unitários automatizados, o sistema contempla validações programáticas implementadas na camada de backend que garantem a integridade e consistência dos dados em tempo de execução.

### 4.1 Validações de Entrada via Bean Validation (DTOs)

**Tipo de validação:** Validação de entrada / Verificação de integridade de dados
**Mecanismo:** Anotações Jakarta Validation (`@NotBlank`, `@Email`, `@Size`) nos DTOs com `@Valid` nos controllers.

| ID    | DTO / Endpoint                            | Campo   | Regra de Validação                                              | Tipo      | Objetivo                                                 | Resultado Obtido (inferido do código)                                   |
| ----- | ----------------------------------------- | ------- | --------------------------------------------------------------- | --------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| VB-01 | `RegisterRequest` / `POST /auth/register` | `nome`  | `@NotBlank` — campo obrigatório                                 | Validação | Impedir cadastro sem nome                                | Retorna HTTP 400 com mensagem "Nome é obrigatório"                      |
| VB-02 | `RegisterRequest` / `POST /auth/register` | `email` | `@NotBlank` + `@Email` — obrigatório e formato válido           | Validação | Impedir cadastro com e-mail vazio ou em formato inválido | Retorna HTTP 400 com mensagem "Email é obrigatório" ou "Email inválido" |
| VB-03 | `RegisterRequest` / `POST /auth/register` | `senha` | `@NotBlank` + `@Size(min=6)` — obrigatória, mínimo 6 caracteres | Validação | Impedir cadastro com senha fraca ou ausente              | Retorna HTTP 400 com mensagem correspondente                            |
| VB-04 | `LoginRequest` / `POST /auth/login`       | `email` | `@NotBlank` + `@Email` — obrigatório e formato válido           | Validação | Impedir login com e-mail vazio ou inválido               | Retorna HTTP 400 com mensagem de erro                                   |
| VB-05 | `LoginRequest` / `POST /auth/login`       | `senha` | `@NotBlank` — campo obrigatório                                 | Validação | Impedir login sem senha                                  | Retorna HTTP 400 com mensagem "Senha é obrigatória"                     |
| VB-06 | `UpdateUserRequest` / `PUT /users/{id}`   | `nome`  | `@Size(min=1, max=100)` — entre 1 e 100 caracteres              | Validação | Garantir tamanho válido do nome na atualização           | Retorna HTTP 400 se fora do intervalo                                   |
| VB-07 | `UpdateUserRequest` / `PUT /users/{id}`   | `email` | `@Email` — formato de e-mail válido                             | Validação | Impedir atualização com e-mail em formato inválido       | Retorna HTTP 400 com mensagem "Email inválido"                          |
| VB-08 | `UpdateUserRequest` / `PUT /users/{id}`   | `senha` | `@Size(min=6)` — mínimo 6 caracteres                            | Validação | Impedir atualização com senha fraca                      | Retorna HTTP 400 se senha menor que 6 caracteres                        |

### 4.2 Tratamento de Exceções (GlobalExceptionHandler)

**Tipo de validação:** Tratamento de erros / Verificação de regras de negócio
**Mecanismo:** Classe `GlobalExceptionHandler` com `@RestControllerAdvice`, capturando exceções específicas e retornando respostas HTTP padronizadas.

| ID    | Exceção                           | Cenário Tratado                                                              | Status HTTP      | Resposta                                                         |
| ----- | --------------------------------- | ---------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------- |
| VB-09 | `EmailAlreadyExistsException`     | Tentativa de cadastro ou atualização com e-mail duplicado                    | 409 Conflict     | `{ success: false, message: "Email já cadastrado: {email}" }`    |
| VB-10 | `UserNotFoundException`           | Tentativa de login, consulta, atualização ou exclusão de usuário inexistente | 404 Not Found    | `{ success: false, message: "Usuário não encontrado..." }`       |
| VB-11 | `InvalidPasswordException`        | Tentativa de login com senha incorreta                                       | 401 Unauthorized | `{ success: false, message: "Senha inválida" }`                  |
| VB-12 | `MethodArgumentNotValidException` | Violação de qualquer regra de Bean Validation                                | 400 Bad Request  | `{ success: false, message: "{mensagem da primeira violação}" }` |

### 4.3 Validações de Regra de Negócio nos Serviços

**Tipo de validação:** Lógica de negócio
**Mecanismo:** Verificações condicionais implementadas nas classes `AuthService` e `UserService`.

| ID    | Serviço / Método           | Regra de Negócio                                                                | Objetivo                                                        | Resultado Obtido (inferido do código)                                   |
| ----- | -------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| VB-13 | `AuthService.register()`   | Verificar se `existsByEmail()` retorna `true` antes de criar o usuário          | Impedir cadastro duplicado de e-mail                            | Lança `EmailAlreadyExistsException` se e-mail já existe                 |
| VB-14 | `AuthService.register()`   | Codificar senha com `BCryptPasswordEncoder.encode()` antes de salvar            | Garantir que senhas não sejam armazenadas em texto puro         | Senha salva no banco em formato hash BCrypt                             |
| VB-15 | `AuthService.login()`      | Buscar usuário por e-mail; lançar exceção se não encontrado                     | Impedir login com e-mail não cadastrado                         | Lança `UserNotFoundException` se e-mail não existe                      |
| VB-16 | `AuthService.login()`      | Comparar senha fornecida com hash via `passwordEncoder.matches()`               | Validar credenciais de forma segura                             | Lança `InvalidPasswordException` se senha não confere                   |
| VB-17 | `UserService.updateUser()` | Verificar duplicidade de e-mail somente se o novo e-mail for diferente do atual | Permitir atualização sem alterar e-mail sem erro de duplicidade | Lança `EmailAlreadyExistsException` somente se e-mail mudou e já existe |
| VB-18 | `UserService.updateUser()` | Aplicar atualização parcial — atualizar apenas campos não nulos e não vazios    | Permitir atualização de campos individuais                      | Campos `null` ou em branco são ignorados na atualização                 |
| VB-19 | `UserService.updateUser()` | Codificar nova senha com BCrypt antes de salvar                                 | Manter segurança de senhas mesmo em atualizações                | Nova senha salva em formato hash BCrypt                                 |
| VB-20 | `UserService.deleteUser()` | Verificar existência do usuário antes de excluir                                | Impedir exclusão de usuários inexistentes                       | Lança `UserNotFoundException` se ID não existe                          |

---

## 5. Validações Programáticas (Frontend — React Native)

### 5.1 Validações de Interface — Tela de Cadastro (`sign-up.tsx`)

**Tipo de validação:** Validação de formulário no lado do cliente
**Mecanismo:** Verificações condicionais na função `handleSignUp()` antes da chamada à API.

| ID    | Validação                                                | Objetivo                                                         | Resultado Obtido (inferido do código)                    |
| ----- | -------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| VF-01 | Campos obrigatórios (nome, e-mail, senha, repetir senha) | Impedir envio do formulário com campos vazios                    | Exibe `Alert` com mensagem "Preencha todos os campos."   |
| VF-02 | Confirmação de senha (senha === repetir senha)           | Garantir que o usuário digitou a senha corretamente              | Exibe `Alert` com mensagem "As senhas não coincidem."    |
| VF-03 | Redirecionamento pós-cadastro                            | Encaminhar o usuário à tela principal após cadastro bem-sucedido | Salva dados no storage e redireciona para `/(tabs)/home` |
| VF-04 | Tratamento de erro de resposta                           | Exibir mensagem de erro retornada pela API                       | Exibe `Alert` com `response.message`                     |

### 5.2 Validações de Interface — Tela de Login (`sign-in.tsx`)

**Tipo de validação:** Validação de formulário no lado do cliente
**Mecanismo:** Verificações condicionais na função `handleSignIn()` antes da chamada à API.

| ID    | Validação                           | Objetivo                                                      | Resultado Obtido (inferido do código)                    |
| ----- | ----------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------- |
| VF-05 | Campos obrigatórios (e-mail, senha) | Impedir envio do formulário de login com campos vazios        | Exibe `Alert` com mensagem "Preencha todos os campos."   |
| VF-06 | Redirecionamento pós-login          | Encaminhar o usuário à tela principal após login bem-sucedido | Salva dados no storage e redireciona para `/(tabs)/home` |
| VF-07 | Tratamento de erro de resposta      | Exibir mensagem de erro retornada pela API                    | Exibe `Alert` com `response.message`                     |

### 5.3 Validações de Interface — Tela Principal (`home.tsx`)

**Tipo de validação:** Validação de formulário e lógica de negócio no lado do cliente
**Mecanismo:** Verificações condicionais nas funções `handleUpdate()`, `handleDelete()` e `handleLogout()`.

| ID    | Validação                                         | Objetivo                                                    | Resultado Obtido (inferido do código)                          |
| ----- | ------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| VF-08 | Campos obrigatórios na atualização (nome, e-mail) | Impedir atualização sem nome ou e-mail                      | Exibe `Alert` com mensagem "Nome e e-mail são obrigatórios."   |
| VF-09 | Detecção de alterações antes de enviar            | Evitar chamadas à API quando nenhum dado foi modificado     | Exibe `Alert` com mensagem "Nenhuma alteração detectada."      |
| VF-10 | Envio apenas de campos alterados                  | Otimizar a requisição enviando somente os dados modificados | Monta payload dinâmico comparando valores atuais com originais |
| VF-11 | Confirmação de exclusão de conta                  | Prevenir exclusão acidental com diálogo de confirmação      | Exibe `Alert` com opções "Cancelar" e "Excluir" (destructive)  |
| VF-12 | Logout com limpeza de dados                       | Garantir que a sessão é completamente encerrada             | Chama `clearUser()` e redireciona para `/(auth)/sign-in`       |
| VF-13 | Verificação de sessão ativa ao carregar           | Redirecionar para login se não há usuário logado            | Se `getStoredUser()` retorna `null`, redireciona para sign-in  |

---

## 6. Matriz de Rastreabilidade

A tabela abaixo relaciona as funcionalidades do sistema com os respectivos testes e validações aplicados.

| Funcionalidade       | Testes Unitários (CT)      | Validações Backend (VB)                   | Validações Frontend (VF) |
| -------------------- | -------------------------- | ----------------------------------------- | ------------------------ |
| Cadastro de Usuário  | CT-01, CT-02, CT-03        | VB-01 a VB-03, VB-09, VB-12 a VB-14       | VF-01 a VF-04            |
| Login de Usuário     | CT-04, CT-05, CT-06, CT-07 | VB-04, VB-05, VB-10 a VB-12, VB-15, VB-16 | VF-05 a VF-07            |
| Consulta de Usuário  | CT-08, CT-09               | VB-10, VB-20                              | VF-13                    |
| Atualização de Dados | CT-10 a CT-14              | VB-06 a VB-10, VB-12, VB-17 a VB-19       | VF-08 a VF-10            |
| Exclusão de Conta    | CT-15, CT-16, CT-17        | VB-10, VB-20                              | VF-11                    |
| Armazenamento Local  | CT-18 a CT-21              | —                                         | —                        |
| Logout               | CT-21                      | —                                         | VF-12                    |

---

## 7. Resumo Quantitativo

| Categoria                                | Quantidade |
| ---------------------------------------- | ---------- |
| Testes unitários automatizados (Jest)    | 21         |
| Validações de entrada — Backend (DTOs)   | 8          |
| Tratamento de exceções — Backend         | 4          |
| Validações de regra de negócio — Backend | 8          |
| Validações de interface — Frontend       | 13         |
| **Total de verificações documentadas**   | **54**     |

---

## 8. Execução dos Testes

### 8.1 Comandos de Execução

```bash
# Executar todos os testes unitários
cd frontend
npx jest

# Executar em modo watch (re-execução automática)
npx jest --watch

# Executar com relatório de cobertura de código
npx jest --coverage

# Executar arquivo de teste específico
npx jest src/__tests__/authService.test.ts
```

### 8.2 Critérios de Aceitação

- Todos os 21 casos de teste automatizados devem ser aprovados (status _pass_).
- Nenhum teste deve depender de servidor externo, banco de dados real ou rede — todos os recursos externos são mockados.
- O tempo total de execução da suíte de testes não deve exceder 10 segundos.
- O ambiente de teste deve ser limpo entre execuções (`beforeEach` com `clearAllMocks`).

---

## 9. Considerações Finais

O plano de testes documentado neste artefato demonstra que o sistema TrainEasy contempla uma cobertura abrangente de verificações, organizadas em três camadas complementares:

1. **Testes unitários automatizados** (21 casos), que verificam o comportamento correto das funções de serviço do frontend, incluindo cenários de sucesso, erro de negócio e falha de conexão.

2. **Validações programáticas no backend** (20 verificações), que garantem a integridade dos dados por meio de Bean Validation nos DTOs, tratamento centralizado de exceções e regras de negócio nos serviços, incluindo segurança com criptografia BCrypt para senhas.

3. **Validações programáticas no frontend** (13 verificações), que garantem a experiência do usuário com verificação de campos obrigatórios, confirmação de senha, detecção de alterações, diálogos de confirmação e gerenciamento de sessão.

A arquitetura de testes adotada — com isolamento total via mocks, limpeza entre execuções e cobertura de cenários positivos e negativos — está alinhada com as boas práticas de engenharia de software e fornece uma base sólida para a garantia de qualidade do sistema.
