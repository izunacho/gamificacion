# LifeQuest — gamifica tu vida real

App web (React + TypeScript + Vite) que convierte hábitos y objetivos de la vida real en un RPG personal: tienes un avatar con nivel, EXP, vida y atributos, ganas recompensas al completar misiones y puedes canjear tu oro en una tienda personalizada.

## Características

- **Avatar**: Nivel, barra de EXP con curva de dificultad progresiva, Vida/Energía, título/clase derivado de tu atributo dominante (Atleta, Estudiante, Sanador, Monje...) y 4 atributos (Fuerza, Enfoque, Salud, Disciplina).
- **Misiones diarias / hábitos**: se completan una vez al día, otorgan EXP + oro, acumulan racha (streak) con bonos cada 7 días, y **penalizan la vida** si no se completan antes de que acabe el día.
- **Misiones de historia / proyectos**: objetivos grandes divididos en subtareas, cada una con su propia recompensa; al completarlas todas se libera una recompensa mayor de EXP y oro.
- **Tienda de recompensas**: define tus propias recompensas personalizadas (ver una película, tu comida favorita, etc.) y cánjealas con el oro ganado. Incluye historial de canjes.
- **Persistencia local**: todo el progreso se guarda en el `localStorage` del navegador, sin necesidad de backend ni cuenta.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

Otros comandos:

```bash
npm run build    # build de producción (type-check + vite build)
npm run lint     # oxlint
npm run preview  # sirve el build de producción localmente
```

## Stack técnico

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Zustand (con middleware `persist` sobre `localStorage`)
- React Router
- lucide-react (iconos)

## Estructura

```
src/
  components/   # UI reutilizable (AvatarCard, StatBar, Modal, Layout, notificaciones)
  pages/        # Dashboard, Misiones, Proyectos, Tienda
  store/        # useGameStore.ts — toda la lógica de juego (EXP, niveles, penalizaciones, compras)
  utils/        # curva de nivel, título por atributo, fechas, estilos por atributo
  types.ts      # modelos de datos (Avatar, DailyQuest, StoryQuest, ShopItem, ...)
```
