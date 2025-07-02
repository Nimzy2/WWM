# World March of Women Kenya Website

A modern, responsive React website for the World March of Women Kenya organization, built with React Router and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first approach with beautiful UI across all devices
- **Modern Navigation**: Clean header and footer with smooth routing
- **Multiple Pages**: Home, About, Blogs, Contact, Join, and Admin sections
- **Custom Color Scheme**: Consistent branding with specified colors
- **Tailwind CSS**: Utility-first CSS framework for rapid development

## Color Palette

- **Primary**: #43245A (Deep Purple)
- **Text**: #232323 (Dark Gray)
- **Accent**: #B6A8C1 (Light Purple)
- **Background**: #EBE2F2 (Very Light Purple)

## Pages

### Home
- Hero section with call-to-action buttons
- Mission statement and core values
- Featured content highlighting the organization's work

### About
- Organization story and history
- Core values and principles
- Leadership team information
- Impact statistics

### Blogs
- Featured blog post
- Blog post grid with categories
- Newsletter signup
- Filter by category functionality

### Contact
- Contact form with validation
- Contact information and office hours
- Social media links
- Location details

### Join
- Membership types and benefits
- Application form
- Areas of interest selection
- County selection dropdown

### Admin
- Dashboard with key metrics
- Member management
- Event management
- Content management
- Analytics overview
- Settings configuration

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd world-march-of-women-kenya
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/
│   ├── Header.js          # Navigation header
│   ├── Footer.js          # Site footer
│   ├── Home.js            # Home page
│   ├── About.js           # About page
│   ├── Blogs.js           # Blogs page
│   ├── Contact.js         # Contact page
│   ├── Join.js            # Join page
│   └── Admin.js           # Admin dashboard
├── App.js                 # Main app component with routing
├── index.js               # App entry point
└── index.css              # Global styles and Tailwind imports
```

## Customization

### Colors
The color scheme can be modified in `tailwind.config.js`:

```javascript
colors: {
  primary: '#43245A',
  text: '#232323',
  accent: '#B6A8C1',
  background: '#EBE2F2',
}
```

### Content
All content is currently hardcoded in the component files. For a production application, consider:
- Implementing a CMS (Contentful, Strapi, etc.)
- Adding a backend API
- Using environment variables for configuration

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy Options

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload the `build` folder to an S3 bucket
- **GitHub Pages**: Use `gh-pages` package

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**World March of Women Kenya** - Empowering women's voices and advocating for gender equality across Kenya. 