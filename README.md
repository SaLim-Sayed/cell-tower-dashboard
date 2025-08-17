# Cell Tower Dashboard

A professional, responsive React dashboard for telecom operations monitoring and cell tower management. Built with TypeScript, Vite, and modern web technologies.

## 🚀 Features

### Core Functionality
- **R Cell Tower Monitoring** - Track tower status, signal strength, and network performance
- **Interactive Data Visualization** - Built with D3.js for charts and analytics
- **Advanced Filtering & Search** - Multi-criteria filtering with real-time search
- **Responsive Data Tables** - Adaptive tables with sorting, pagination, and mobile-friendly views
- **Mobile-First Design** - Optimized for both desktop and mobile devices

### Technical Features
- **TypeScript** - Full type safety and enhanced developer experience
- **Responsive Design** - Adaptive layouts for all screen sizes
- **Modern React** - Uses React 18 with hooks and context
- **SCSS Styling** - Modular and maintainable styling
- **Error Boundaries** - Graceful error handling
- **Testing Suite** - Comprehensive testing with Jest and Testing Library

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern browser with ES2020+ support

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/salimsayed/cell-tower-dashboard.git
   cd cell-tower-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 📝 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run preview` - Preview production build locally

### Building
- `npm run build` - Build for production
- `npm run type-check` - Run TypeScript type checking

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:ci` - Run tests in CI mode

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (buttons, inputs, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   └── data/           # Data-related components (tables, charts)
├── hooks/              # Custom React hooks
├── services/           # API and data services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── styles/             # Global SCSS files
└── assets/             # Static assets (images, icons)
```

## 🧩 Key Components

### DataTable
Flexible, responsive data table with built-in features:
- **Sorting** - Click column headers to sort
- **Pagination** - Configurable page sizes
- **Responsive Views** - Automatic mobile stacking
- **Selection** - Multi-row selection with callbacks
- **Custom Rendering** - Flexible cell content rendering

```typescript
<DataTable
  columns={columns}
  data={towerData}
  keyField="id"
  sortConfig={sortConfig}
  onSortChange={setSortConfig}
  onRowClick={handleRowClick}
  responsive="adaptive"
/>
```

### SmFilters (Mobile Filters)
Mobile-optimized filtering component:
- **Bottom Sheet UI** - Native mobile experience
- **Tabbed Interface** - Separate filters and sort tabs
- **Real-time Updates** - Immediate filter application

```typescript
<SmFilters
  filters={filters}
  cities={cities}
  sortConfig={sortConfig}
  onFiltersChange={onFiltersChange}
  onClearFilters={onClearFilters}
/>
```

### Filters (Desktop)
Desktop filtering component:
- **Inline Controls** - Horizontal filter layout
- **Auto-hiding Sort** - Sort controls hidden on mobile
- **Synchronized State** - Works with mobile filters

## 📱 Responsive Design

The dashboard uses a mobile-first approach with three responsive strategies:

1. **Adaptive** - Components adjust layout based on screen size
2. **Stack** - Tables convert to card-based mobile views
3. **Scroll** - Horizontal scrolling for large datasets

### Breakpoints
- **Mobile**: ≤ 768px
- **Tablet**: 769px - 1024px  
- **Desktop**: ≥ 1025px

## 🎨 Styling Architecture

### SCSS Structure
```
styles/
├── abstracts/
│   ├── _variables.scss    # Design tokens
│   ├── _mixins.scss      # Reusable mixins
│   └── _functions.scss   # SCSS functions
├── base/
│   ├── _reset.scss       # CSS reset
│   ├── _typography.scss  # Font definitions
│   └── _global.scss      # Global styles
├── components/           # Component-specific styles
├── layout/              # Layout-specific styles
└── utilities/           # Utility classes
```

### Design System
- **Colors** - Consistent color palette with CSS custom properties
- **Typography** - Responsive font scaling
- **Spacing** - 8px grid system
- **Shadows** - Layered shadow system for depth

## 🔧 Configuration

### TypeScript Configuration
The project uses strict TypeScript settings for maximum type safety:
- Strict mode enabled
- No implicit any
- Unused locals/parameters detection
- Path mapping for clean imports

## 🧪 Testing

### Testing Stack
- **Jest** - Test runner and assertion library
- **Testing Library** - Component testing utilities
- **jsdom** - Browser environment simulation

### Test Categories
- **Unit Tests** - Individual component testing
- **Integration Tests** - Component interaction testing
 
### Running Tests
```bash
# Watch mode (development)
npm run test

# Single run (CI)
npm run test:ci
```

## 📊 Data Management

### Data Flow
1. **Services Layer** - API calls and data fetching
2. **Context/State** - Application state management
3. **Components** - UI rendering and user interaction

### Filtering & Sorting
The dashboard supports complex data operations:
- **Multi-criteria Filtering** - Search, city, status, etc.
- **Dynamic Sorting** - Any column with type-safe sorting
- **Real-time Updates** - Immediate UI updates
- **State Synchronization** - Desktop and mobile filter sync

## 🔒 Code Quality

### ESLint Configuration
- React-specific rules
- TypeScript integration
- Accessibility checks
- Performance optimizations

### Prettier Integration
- Consistent code formatting
- SCSS support
- Pre-commit hooks via Husky

### Git Hooks
- **pre-commit** - Runs linting and formatting
- **pre-push** - Runs type checking and tests

## 🚀 Deployment

### Build Process
```bash
npm run build
```
Generates optimized production build in `dist/`

### Production Optimizations
- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Removes unused code
- **Asset Optimization** - Image compression and bundling
- **Caching** - Long-term caching with content hashing

## 🛠️ Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📚 Dependencies

### Core Dependencies
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **SASS/SCSS** - Styling
- **D3.js** - Data visualization

### Utility Libraries
- **React Icons** - Icon library
- **React Star Ratings** - Star rating component
- **React Responsive** - Responsive utilities
- **React Error Boundary** - Error handling

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Maintain responsive design
- Follow existing code patterns
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support

For questions, issues, or contributions:

1. **GitHub Issues** - Bug reports and feature requests
2. **Documentation** - Check inline code comments
3. **Code Reviews** - Submit PRs for review

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Core dashboard functionality
- Responsive design implementation
- Complete testing suite
- Production-ready build system

---
