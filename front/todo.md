# Expectativa

## Iteração 1

OK - Auto reload no server
OK - Server e cliente configurado com Typescript - Compartilhando tipos entre projetos
OK - Eventos marcantes
OK - Vitimas
OK - Tela de admin podendo editar vida e essência dos jogadores
OK - Ter atalhos para navegar a ficha (Menubar, Nav Menu)

## Iteração 2

OK - Adicionar json de ocupacoes para relacionar aos personagens
OK - Adicionar json de ocupacao e dados de vida / energia
OK - Dados relacionados (personagem, ocupacao, equipamento)

## Iteração 3

- Websocket
- Edições sendo carregadas em tempo real
- React-Query nas chamadas a API

## Iteração 4

- React-hook-form
- Pagina de admin utilizando react-hook-form e react-query

## Iteração 5

- Habilitar edições de campos para cada jogador {
  - historia
  - eventos
  - notas
}
- Rumores
- Adicionar cores variaveis - admin
- Poder dar e tirar inspiração - admin
- Relacionar cores a elementos

## Iteração 6

- REMOVER "return Character" da API
- Chat com o proprio personagem {
  - bate num endpoint POST com a mensagem
  - monta texto pro gpt
  - ao completar, salva num json
  - envia um evento pro usuario pra refazer um GET no historico de mensagens
}

## Iteração 7

OK - Jogadores podendo dar itens a outros jogadores
OK - Mesa virtual (GRID)
OK - arrumar tela de admin (aumentar e diminuir valores)

CORE {
Front (React):

- Sheet to players maintain their characters (Built in React)
- A map that load UVTT files with dynamic lights (Built in React)
- An admin page where the admin can change their status and updates their page in real time
- An admin will create a session and invite player who will have characters under their profile to play together
- This session will be a room on the server to manage data updates


Front:
    - Sheet to players maintain their characters
    - A map that load UVTT files with dynamic lights
    - An admin page where the admin can change their status and updates their page in real time

Back:
    - Db - Use MongoDB or Postgres?
    - Use GraphQL or Rest
    - Manage user's character data, messaging system with their character AI
    - Auth routes so only the user with dungeon master role can manage their game session
    - Group player by rooms to manage the session updates (like the map) to all players together

}

Mapa {

- Se estiver fora da luz, some do mapa
- Refatorar logicas
- Rota para adicionar foto no DB
- Carregar foto da API
- Quick load de cenarios prontos

}

- Chat room

- Admin define turnos
- Adicionar inimigos
- Calcular consumo sozinho
- Poder adicionar foto do campo de batalha
- Poderem se mexer no seu turno (ver quantos m pode)
- Ver ate onde habilidade pega
- poder adicionar inimgios
- Jogadores poderem ativar sons de habilidades
- Enviar mensagens privadas para jogadores
- Padronizar tela de loading
- Padronizar tela de erro
- Criar componente de footer (atalhos)

- Adicionar vida e mana temporários

- Melhorar prompt GPT (adicionar atributos, companheiros, estado atual, itens)
- Usar lib OpenAI
- Cores pra indicar quão certo a palavra está

- Isolar em componentes codigo repetido
- Padronizar erros (either)
- Pop up de erro no front
- Fazer troca de itens entre jogadores utilizando ENUM para Tipo de item
- Utilizar DTOs
- Adicionar validações no BackEnd (dados numericos nos status, tipagem entre back e front, enums, slice das mensagens, padronizar esquema de pegar personagem)
- Verificar dados de cache

- Editor de mapa
- Adicionar banco de dados (SQL, NoSQL, Google Drive?)
- Adicionar possibilidade de ler o guia do jogo pelo site
- Adicionar forma de autenticacao (JWT? Session-Based? Simple-cookie?)
- Adicionar Metodo de login seguro (google)
- Adicionar metodo de pagamento

Então o roadmap vai ser:

- Finalizar o que ta semi pronto
- Organizar porque ta tudo meio bagunçado
- Criar a landing page e hospedar online
- Poder criar próprios campos do RPG
- Adicionar autorização e autenticação (JWT? Session-Based? Simple-cookie?)
- Divulgar pras pessoas

--- TOKEN
People stress too much about a single DB call to fetch the user. Even a fairly simple app you have 3-4 db calls,

say a blogspot, the Blog (1), the Author (2), Comment List (3), Comment Author List (4), Comment Like Count (5)

In more complex apps, it is not even a simple SELECT, but a query with multiple JOINs and UNION and subqueries, which is order of magnitude more costly than a single SELECT FROM users.

The scale at which a single SELECT make such a difference is millions of users, if not tens of millions. And no, your TODO app wont make it that far. In fact most of the project my company work on dont have userbase in the millions.

Dont stress too much about avoiding a db call for auth. Especially when you have to sacrifice control (cannot revoke), or use a db anyway for whitelist/ blacklist, plus signing algorithm overhead, plus a more complex control flow.

Nothing in programming comes for free, and JWT is not a silver bullet.

As for, what to use. Simple cookie/ session works fine, and even more secure than JWT technically, simce there is nowhere safe to store token in the browser. The industry also is moving back to cookie/ session with the rise of BFF - Backend For Frontend, where you add a middleman server (usually Next server, Nuxt server, SvelteKit server,...) Between the browser and main api

Browser send email/ password to the Next server (via server component for example) the Next server proxy it the main backend, main backend send back a Personal Access Token. Next server save this token (in memory, file, redis, mongo, whatever), then initiate session/ cookie auth for browser. Browser now authenticate with cookie session, if auth is successful, Next server fetch the associated token and use it to make api call to the main backend
