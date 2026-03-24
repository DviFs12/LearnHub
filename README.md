# 📚 LearnHub — Plataforma de Cursos Offline

Plataforma de cursos interativa, 100% offline, pronta para hospedar no **GitHub Pages** sem nenhuma configuração de servidor ou build step.

---

## 🚀 Como usar

### Localmente
Abra `index.html` no navegador. **Importante:** alguns navegadores bloqueiam `fetch()` de arquivos locais por segurança. Se os cursos não carregarem, use um servidor local simples:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

Depois acesse `http://localhost:8000`.

### GitHub Pages
1. Fork ou clone este repositório
2. Vá em **Settings → Pages**
3. Source: branch `main`, pasta `/` (root)
4. Seu site estará em `https://seu-usuario.github.io/nome-do-repo`

---

## 📁 Estrutura de arquivos

```
learnhub/
├── index.html              ← Hub principal (lista de cursos)
├── course.html             ← Player de curso (lições + apostila)
├── store.html              ← Loja de temas
├── css/
│   └── shared.css          ← Estilos compartilhados
├── js/
│   ├── state.js            ← Gerenciamento de estado (localStorage)
│   └── themes.js           ← Sistema de temas dinâmico
└── courses/
    └── calculus/
        ├── course.json     ← Manifest do curso
        └── lessons/
            ├── u1l1.json   ← Lição individual
            ├── u1l2.json
            └── ...
```

---

## ➕ Como criar seu próprio curso

### 1. Crie a estrutura de pastas

```
courses/meu-curso/
├── course.json
└── lessons/
    ├── l1.json
    └── l2.json
```

### 2. Escreva o `course.json`

```json
{
  "id": "meu-curso",
  "title": "Meu Curso",
  "subtitle": "Uma breve descrição",
  "description": "Descrição completa do curso exibida na página inicial.",
  "emoji": "🔬",
  "level": "Iniciante",
  "estimatedHours": 10,
  "pointsTotal": 500,
  "tags": ["ciência", "física"],
  "prerequisites": "Nenhum",
  "units": [
    {
      "id": "u1",
      "title": "Unidade 1",
      "emoji": "📖",
      "description": "Descrição da unidade",
      "lessons": [
        { "id": "u1l1", "title": "Primeira Lição", "file": "lessons/u1l1.json", "points": 80 }
      ]
    }
  ],
  "apostila": {
    "sections": [
      {
        "title": "Seção da Apostila",
        "items": [
          {
            "heading": "Conceito importante",
            "text": "Explicação do conceito...",
            "formula": "E = mc²"
          }
        ]
      }
    ]
  }
}
```

### 3. Escreva as lições (`lessons/u1l1.json`)

Cada lição tem um array de `steps`. Existem 3 tipos:

#### Tela de teoria
```json
{
  "type": "theory",
  "title": "Título da teoria",
  "blocks": [
    { "type": "para", "heading": "Subtítulo", "text": "Texto com <strong>negrito</strong> suportado." },
    { "type": "formula", "text": "f(x) = x²\n\n// comentários aceitos" },
    { "type": "callout", "kind": "info", "icon": "💡", "text": "Dica importante." },
    { "type": "callout", "kind": "warn", "icon": "⚠️", "text": "Atenção!" },
    { "type": "callout", "kind": "tip", "icon": "✅", "text": "Bom saber." },
    { "type": "example", "label": "Título do exemplo", "body": "Conteúdo do exemplo\nem múltiplas linhas" }
  ]
}
```

#### Questão de múltipla escolha
```json
{
  "type": "mcq",
  "formula": "f(x) = x²",
  "stem": "Qual é a derivada de f(x)?",
  "opts": ["x", "2x", "x²", "2x²"],
  "correct": 1,
  "exp": "Usando a regra da potência: d/dx x² = 2x."
}
```

#### Resposta aberta
```json
{
  "type": "input",
  "formula": "lim(x→2) x³",
  "stem": "Calcule o limite. Digite o resultado.",
  "correct": "8",
  "exp": "Substituindo: 2³ = 8 ✓"
}
```

### 4. Adicione ao LearnHub

**Opção A — Curso na mesma pasta (mais simples):**
Abra `index.html`, clique em **"+ Adicionar curso"** e informe:
```
courses/meu-curso/course.json
```

**Opção B — Adicione diretamente no código:**
Em `index.html`, no script, adicione o caminho ao array:
```js
const BUILTIN_COURSES = [
  'courses/calculus/course.json',
  'courses/meu-curso/course.json',  // ← adicione aqui
];
```

**Opção C — Curso em outro repositório GitHub (URL completa):**
```
https://usuario.github.io/repo/courses/fisica/course.json
```

---

## 🎨 Sistema de Temas

O tema é composto por **modo** (claro/escuro) + **cor de destaque**. A loja (`store.html`) permite:

- Alternar entre modo claro e escuro
- Comprar esquemas de cores com pontos ganhos nas lições
- O tema persiste entre páginas via `localStorage`

### Temas disponíveis

| Tema | Preço | Descrição |
|------|-------|-----------|
| Padrão | Grátis | Laranja avermelhado |
| Violeta | 150 pts | Tons de roxo |
| Esmeralda | 150 pts | Tons de verde |
| Rosa | 150 pts | Tons de rosa |
| Âmbar | 200 pts | Tons de amarelo/ouro |
| Meia-noite | 200 pts | Tons de azul escuro |
| Obsidiana | 500 pts | Monocromático escuro |

---

## ⭐ Sistema de Pontos

- **+15 pontos** por questão correta
- **+pontos da lição** ao concluir (proporcional à precisão)
- **+30 pontos bônus** por 100% de acerto
- Use pontos para comprar temas na loja

---

## 💾 Armazenamento de dados

Tudo salvo em `localStorage` — sem servidor, sem conta:

- Pontos acumulados
- Temas comprados e tema ativo
- Lições concluídas (com precisão, pontos e data)
- Streak de dias estudados
- Histórico de atividade (28 dias)
- Cursos externos adicionados

Para redefinir: `localStorage.removeItem('learnhub_v1')`

---

## 🛠 Tecnologias

- **HTML5, CSS3, JavaScript** vanilla — sem frameworks
- **Fontes:** Fraunces, JetBrains Mono, Plus Jakarta Sans (Google Fonts)
- **Persistência:** localStorage
- **Dados dos cursos:** JSON puro (carregados via `fetch`)
- Zero dependências, zero build step

---

## 📝 Licença

MIT — use, modifique, distribua e crie seus próprios cursos livremente.
