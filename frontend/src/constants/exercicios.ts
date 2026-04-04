export interface ExercicioCatalogo {
  nome: string;
  grupo: string;
}

export const EXERCICIOS_CATALOGO: ExercicioCatalogo[] = [
  // Peito
  { nome: "Supino Reto", grupo: "Peito" },
  { nome: "Supino Inclinado", grupo: "Peito" },
  { nome: "Supino Declinado", grupo: "Peito" },
  { nome: "Crucifixo", grupo: "Peito" },
  { nome: "Crossover", grupo: "Peito" },
  { nome: "Flexão de Braço", grupo: "Peito" },
  { nome: "Fly na Máquina", grupo: "Peito" },

  // Costas
  { nome: "Puxada Frontal", grupo: "Costas" },
  { nome: "Puxada Atrás", grupo: "Costas" },
  { nome: "Remada Curvada", grupo: "Costas" },
  { nome: "Remada Unilateral", grupo: "Costas" },
  { nome: "Remada Baixa", grupo: "Costas" },
  { nome: "Pulldown", grupo: "Costas" },
  { nome: "Barra Fixa", grupo: "Costas" },

  // Ombros
  { nome: "Desenvolvimento com Halteres", grupo: "Ombros" },
  { nome: "Desenvolvimento Militar", grupo: "Ombros" },
  { nome: "Elevação Lateral", grupo: "Ombros" },
  { nome: "Elevação Frontal", grupo: "Ombros" },
  { nome: "Crucifixo Inverso", grupo: "Ombros" },
  { nome: "Encolhimento", grupo: "Ombros" },

  // Bíceps
  { nome: "Rosca Direta", grupo: "Bíceps" },
  { nome: "Rosca Alternada", grupo: "Bíceps" },
  { nome: "Rosca Martelo", grupo: "Bíceps" },
  { nome: "Rosca Scott", grupo: "Bíceps" },
  { nome: "Rosca Concentrada", grupo: "Bíceps" },

  // Tríceps
  { nome: "Tríceps Pulley", grupo: "Tríceps" },
  { nome: "Tríceps Testa", grupo: "Tríceps" },
  { nome: "Tríceps Francês", grupo: "Tríceps" },
  { nome: "Tríceps Coice", grupo: "Tríceps" },
  { nome: "Mergulho", grupo: "Tríceps" },

  // Pernas
  { nome: "Agachamento Livre", grupo: "Pernas" },
  { nome: "Agachamento Smith", grupo: "Pernas" },
  { nome: "Leg Press", grupo: "Pernas" },
  { nome: "Cadeira Extensora", grupo: "Pernas" },
  { nome: "Mesa Flexora", grupo: "Pernas" },
  { nome: "Cadeira Flexora", grupo: "Pernas" },
  { nome: "Stiff", grupo: "Pernas" },
  { nome: "Passada", grupo: "Pernas" },
  { nome: "Búlgaro", grupo: "Pernas" },
  { nome: "Cadeira Abdutora", grupo: "Pernas" },
  { nome: "Cadeira Adutora", grupo: "Pernas" },
  { nome: "Panturrilha em Pé", grupo: "Pernas" },
  { nome: "Panturrilha Sentado", grupo: "Pernas" },

  // Abdômen
  { nome: "Abdominal Crunch", grupo: "Abdômen" },
  { nome: "Abdominal Infra", grupo: "Abdômen" },
  { nome: "Prancha", grupo: "Abdômen" },
  { nome: "Abdominal Oblíquo", grupo: "Abdômen" },
  { nome: "Abdominal na Máquina", grupo: "Abdômen" },
];

export const GRUPOS_MUSCULARES = [
  "Peito",
  "Costas",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Pernas",
  "Abdômen",
] as const;
