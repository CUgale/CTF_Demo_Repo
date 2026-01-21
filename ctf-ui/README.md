# CTF Dashboard - Continuous Testing Framework UI

A modern React-based dashboard for the Continuous Testing Framework, built with Vite, TypeScript, Redux, and Ant Design.

## 🚀 Features

- **Mock Mode Support**: Run the entire application without a backend API
- **Project Management**: View and switch between multiple dbt projects
- **Job Creation**: Create and trigger test execution jobs
- **Job Monitoring**: Track job execution phases and status
- **Test Review**: Review and manage generated tests
- **Dashboard Analytics**: View project statistics and metrics

## 📋 Prerequisites

- Node.js 18+ and npm
- Git (for version control)

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Build

```bash
# Build for production
npm run build
```

Build output is generated in `dist/` directory.

## 🎭 Mock Mode

This application supports a mock mode for demos and development. See [MOCK_MODE_README.md](./MOCK_MODE_README.md) for details.

### Quick Enable Mock Mode

1. **URL Parameter**: Add `?mock=true` to your URL
2. **LocalStorage**: `localStorage.setItem('useMockData', 'true')` then refresh
3. **Environment Variable**: Set `VITE_USE_MOCK_DATA=true` in `.env`

## 📦 Project Structure

```
ctf-ui/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── layouts/         # Layout components
│   ├── routes/          # Routing configuration
│   ├── redux/           # Redux store and sagas
│   ├── services/        # API services and mock data
│   ├── context/         # React context providers
│   └── assets/          # Static assets
├── public/              # Public assets
├── .github/             # GitHub Actions workflows
└── dist/                # Build output (generated)
```

## 🌐 Deployment

This project is configured for deployment to GitHub Pages. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step instructions.

### Quick Deploy to GitHub Pages

1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. GitHub Actions will automatically build and deploy

## 🧪 Development

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Redux Saga** - Side effects
- **React Router** - Routing
- **Ant Design** - UI component library
- **ApexCharts** - Data visualization
- **SCSS** - Styling

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Configuration

### Environment Variables

- `VITE_USE_MOCK_DATA` - Enable mock mode (set to `true`)
- `VITE_REPO_NAME` - Repository name for GitHub Pages (auto-set in CI/CD)

### Vite Configuration

The `vite.config.ts` file contains build and server configuration. For GitHub Pages deployment, the base path is automatically configured.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
- Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- Review [Mock Mode Documentation](./MOCK_MODE_README.md)
- Check GitHub Actions logs for deployment issues

## 🔗 Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
