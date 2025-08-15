# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```



cell-tower-dashboard/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dashboard.scss
│   │   │   └── Dashboard.test.tsx
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── Header.scss
│   │   │   └── Header.test.tsx
│   │   ├── SummaryCards/
│   │   │   ├── SummaryCards.tsx
│   │   │   ├── SummaryCards.scss
│   │   │   └── SummaryCards.test.tsx
│   │   ├── Filters/
│   │   │   ├── Filters.tsx
│   │   │   ├── Filters.scss
│   │   │   └── Filters.test.tsx
│   │   ├── DataTable/
│   │   │   ├── DataTable.tsx
│   │   │   ├── DataTable.scss
│   │   │   └── DataTable.test.tsx
│   │   ├── Charts/
│   │   │   ├── BarChart/
│   │   │   │   ├── BarChart.tsx
│   │   │   │   ├── BarChart.scss
│   │   │   │   └── BarChart.test.tsx
│   │   │   └── PieChart/
│   │   │       ├── PieChart.tsx
│   │   │       ├── PieChart.scss
│   │   │       └── PieChart.test.tsx
│   │   └── common/
│   │       ├── LoadingSpinner/
│   │       └── ErrorBoundary/
│   ├── hooks/
│   │   ├── useDashboardData.ts
│   │   ├── useDashboardData.test.ts
│   │   ├── useFilters.ts
│   │   └── useFilters.test.ts
│   ├── services/
│   │   ├── dataService.ts
│   │   └── dataService.test.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── dashboard.types.ts
│   ├── utils/
│   │   ├── chartHelpers.ts
│   │   ├── dataHelpers.ts
│   │   └── constants.ts
│   ├── styles/
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   ├── globals.scss
│   │   └── responsive.scss
│   ├── data/
│   │   └── mockData.ts
│   ├── App.tsx
│   ├── App.scss
│   ├── index.tsx
│   └── setupTests.ts
├── package.json
├── tsconfig.json
├── jest.config.js
├── .gitignore
└── README.md

