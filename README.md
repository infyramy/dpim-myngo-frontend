# myNGO Frontend - Fully Independent Vue 3 Application

**🎨 Completely independent Vue 3 frontend application for the myNGO platform.**

This frontend application is now **fully separated** and has no dependencies on any backend code or shared files. It can be deployed, developed, and maintained independently as a standalone single-page application.

## ✨ Features

- ⚡ **Vue 3** with Composition API and `<script setup>` syntax
- 🎨 **TailwindCSS** for modern, responsive styling
- 📱 **Responsive Design** with mobile-first approach
- 🔒 **JWT Authentication** with automatic token refresh
- 🌐 **Internationalization** (i18n) support with Vue I18n
- 📊 **Dashboard** with charts and analytics using UnoVis
- 🎯 **Role-based** access control (Admin, User, Operator, SuperAdmin)
- 🔍 **Advanced Search** and filtering capabilities
- 📋 **Form Validation** using Vuelidate
- 🎭 **Shadcn/ui** components with Radix Vue
- ⚡ **Vite** for lightning-fast development and building
- 🚀 **PWA** ready with offline capabilities
- 🎨 **Dark/Light Mode** support
- ♿ **Accessibility** focused components

## 🏗️ Project Structure

```
myngo-frontend/
├── src/
│   ├── assets/          # Static assets (images, styles, icons)
│   ├── components/      # Reusable Vue components
│   │   ├── ui/         # Shadcn/ui components
│   │   └── ...         # Custom components
│   ├── composables/     # Vue composables (shared logic)
│   ├── layouts/         # Page layouts (auth, dashboard, admin)
│   ├── pages/           # Page components and routes
│   ├── plugins/         # Vue plugins (i18n, analytics)
│   ├── router/          # Vue Router configuration
│   ├── services/        # API services and utilities
│   ├── stores/          # Pinia stores (state management)
│   ├── types/           # TypeScript type definitions
│   └── main.ts          # Application entry point
├── public/              # Public static assets
├── package.json         # Dependencies and scripts
├── vite.config.mts      # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0 or pnpm >= 8.0.0

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables (optional):**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

### Backend Integration

**Important**: This frontend expects a backend API running on `http://localhost:3001` by default. 

- **Development**: Vite proxy automatically forwards `/api` requests to the backend
- **Production**: Configure `VITE_API_BASE_URL` environment variable

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run test` - Run unit tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=myNGO
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false

# Third-party Services
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_SENTRY_DSN=your-sentry-dsn

# Theme Configuration
VITE_DEFAULT_THEME=light
VITE_ENABLE_THEME_SWITCHER=true
```

## 🎨 Key Features

### 🔐 Authentication System
- **Login/Register** with email verification
- **JWT-based authentication** with automatic refresh
- **Role-based access control** for different user types
- **Password reset** functionality
- **OTP verification** support
- **Remember me** functionality

### 📊 Dashboard System
- **Admin Dashboard**: Complete oversight with analytics and user management
- **User Dashboard**: Business management and application tracking
- **Operator Dashboard**: Member management and program coordination
- **SuperAdmin Dashboard**: System-wide controls and health monitoring

### 🏢 Business Management
- **Business Registration**: Multi-step business onboarding
- **Profile Management**: Comprehensive business information editing
- **Product Catalog**: Showcase products and services with images
- **Application Tracking**: Monitor grant and program applications
- **Document Management**: Upload and manage business documents

### 🛍️ Product Marketplace
- **Product Showcase**: Display products with detailed descriptions
- **Smart Search**: Advanced filtering by category, location, business type
- **Product Matching**: AI-powered recommendations
- **Tag System**: Flexible categorization and discovery
- **Image Gallery**: Multiple product images with optimization

### 👥 User Management
- **Member Directory**: Comprehensive member listings
- **Role Assignment**: Flexible user role management
- **Profile System**: Detailed user profiles with customization
- **Activity Tracking**: User activity and engagement monitoring

### 🎭 UI Components
- **Modern Design System**: Built with Shadcn/ui components
- **Responsive Components**: Mobile-first responsive design
- **Accessibility**: WCAG compliant components
- **Form Components**: Advanced form controls with validation
- **Data Tables**: Sortable, filterable data tables
- **Charts & Analytics**: Interactive charts with UnoVis
- **Loading States**: Elegant loading and skeleton components

### 🌐 Internationalization
```typescript
// Easy translation support
const { t } = useI18n()
console.log(t('dashboard.welcome')) // "Welcome to Dashboard"

// Supported languages
- English (en)
- Spanish (es)
- Add more in src/locales/
```

## 🗂️ State Management

Uses Pinia for type-safe state management:

```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  
  const login = async (credentials: LoginCredentials) => {
    // Login logic with API integration
  }
  
  return { user, isAuthenticated, login }
})
```

## 🎯 Routing & Navigation

Vue Router with role-based route protection:

```typescript
// Automatic route protection based on user roles
routes: [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['admin', 'superadmin'] }
  },
  {
    path: '/user',
    component: UserLayout, 
    meta: { requiresAuth: true, roles: ['user'] }
  }
]
```

## 🎨 Styling & Theming

### TailwindCSS Configuration
- **Custom Color Palette**: Brand-specific colors
- **Responsive Breakpoints**: Mobile-first design
- **Dark Mode**: Automatic system detection
- **Component Variants**: Consistent design tokens

### Theme Customization
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        accent: {
          50: '#fdf2f8',
          500: '#ec4899',
          900: '#831843',
        }
      }
    }
  }
}
```

## 🚀 Building for Production

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

### Preview Production Build
```bash
npm run preview
```

## 📦 Deployment Options

### Static Hosting Services
- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Upload `dist/` folder or connect Git repository
- **AWS S3 + CloudFront**: Upload built files to S3 bucket
- **GitHub Pages**: Deploy from `dist/` directory
- **Surge.sh**: Simple command-line deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t myngo-frontend .

# Run container
docker run -p 3000:3000 myngo-frontend
```

### Deployment Configuration
Set environment variables for production:
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=myNGO Production
VITE_ENABLE_ANALYTICS=true
```

## 🧪 Testing

### Unit Testing with Vitest
```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Component Testing
```typescript
// Example component test
import { render, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('renders properly', () => {
    render(MyComponent, { props: { msg: 'Hello' } })
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## 🔧 Development Guidelines

### Adding New Features

1. **Create Components** in `src/components/`
   ```bash
   src/components/
   ├── BusinessCard.vue
   ├── ProductList.vue
   └── forms/
       └── BusinessForm.vue
   ```

2. **Add Pages** in `src/pages/`
   ```bash
   src/pages/
   ├── user/
   │   ├── dashboard/
   │   │   └── index.vue
   │   └── businesses/
   │       └── [id]/
   │           └── index.vue
   ```

3. **Update Router** in `src/router/routes/`
4. **Add API Services** in `src/services/`
5. **Create Types** in `src/types/`

### Code Style & Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for Vue 3 and TypeScript
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality assurance

## 📈 Performance Optimization

### Built-in Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Dead code elimination
- **Image Optimization**: Automatic image compression
- **PWA Features**: Offline functionality and caching
- **Lazy Loading**: Components and routes loaded on demand

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🛠️ Customization

### Adding New UI Components
1. Install component library or create custom components
2. Add to `src/components/ui/`
3. Export in appropriate index files
4. Document usage and props

### Extending the Theme
1. Update `tailwind.config.js`
2. Add custom CSS variables in `src/assets/index.css`
3. Update TypeScript theme types

### API Integration
1. Create service files in `src/services/`
2. Define TypeScript interfaces in `src/types/`
3. Use composables for reactive API integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the code style guidelines
4. Write or update tests for your changes
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Check linting
npm run lint
```

## 📚 Documentation & Resources

- **[Vue 3 Documentation](https://vuejs.org/)** - Vue.js framework
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript guide
- **[Shadcn/ui Documentation](https://ui.shadcn.com/)** - UI components
- **[TailwindCSS Documentation](https://tailwindcss.com/docs)** - CSS framework
- **[Pinia Documentation](https://pinia.vuejs.org/)** - State management
- **[Vite Documentation](https://vitejs.dev/)** - Build tool
- **[Vue Router Documentation](https://router.vuejs.org/)** - Routing
- **[Vitest Documentation](https://vitest.dev/)** - Testing framework

## 📄 License

This project is licensed under the MIT License.

---

**This frontend is now completely independent and can be deployed separately from any backend API!** 🎉

**Happy coding!** ✨ 