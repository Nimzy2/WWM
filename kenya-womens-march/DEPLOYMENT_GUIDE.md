# 🚀 Vercel Deployment Guide - Kenya Women's March Website

## 📋 **Pre-Deployment Checklist**

### Step 1: Fix Dependencies
```bash
# Install missing dependencies
npm install react-helmet

# Verify all dependencies are installed
npm install

# Test the build locally
npm run build
```

### Step 2: Prepare Environment Variables
Create a `.env` file in your project root:
```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_SHOW_PERFORMANCE=false
```

## 🌐 **Method 1: Vercel Web Dashboard (Recommended)**

### Step 1: Prepare Your Repository
1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### Step 2: Connect to Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Sign Up" or "Log In"**
3. **Choose your Git provider** (GitHub, GitLab, or Bitbucket)
4. **Authorize Vercel** to access your repositories

### Step 3: Import Your Project
1. **Click "New Project"**
2. **Find and select your repository** (`kenya-womens-march`)
3. **Click "Import"**

### Step 4: Configure Project Settings
1. **Project Name**: `kenya-womens-march` (or your preferred name)
2. **Framework Preset**: Select **"Create React App"**
3. **Root Directory**: Leave as `/` (or `kenya-womens-march` if your repo contains multiple projects)
4. **Build Command**: `npm run build`
5. **Output Directory**: `build`
6. **Install Command**: `npm install`

### Step 5: Set Environment Variables
1. **Click "Environment Variables"**
2. **Add each variable**:
   ```
   Name: REACT_APP_SUPABASE_URL
   Value: https://your-project.supabase.co
   Environment: Production, Preview, Development
   ```
   ```
   Name: REACT_APP_SUPABASE_ANON_KEY
   Value: your_anon_key_here
   Environment: Production, Preview, Development
   ```
   ```
   Name: REACT_APP_SHOW_PERFORMANCE
   Value: false
   Environment: Production, Preview, Development
   ```

### Step 6: Deploy
1. **Click "Deploy"**
2. **Wait for build to complete** (usually 2-5 minutes)
3. **Your site will be live** at the provided URL

## 💻 **Method 2: Vercel CLI**

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
- Follow the browser prompts to authenticate

### Step 3: Deploy Your Project
```bash
# Navigate to your project directory
cd kenya-womens-march

# Deploy
vercel
```

### Step 4: Follow the Prompts
```
? Set up and deploy "~/kenya-womens-march"? [Y/n] y
? Which scope do you want to deploy to? [your-username]
? Link to existing project? [y/N] n
? What's your project's name? kenya-womens-march
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

### Step 5: Set Environment Variables
```bash
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY
vercel env add REACT_APP_SHOW_PERFORMANCE
```

## 🔧 **Post-Deployment Configuration**

### Step 1: Custom Domain (Optional)
1. **Go to your Vercel dashboard**
2. **Click on your project**
3. **Go to "Settings" → "Domains"**
4. **Add your custom domain**
5. **Follow DNS configuration instructions**

### Step 2: Environment Variables for Production
1. **Go to Project Settings → Environment Variables**
2. **Ensure all variables are set for Production environment**
3. **Redeploy if needed**

### Step 3: Test Your Deployment
1. **Visit your live URL**
2. **Test all forms and functionality**
3. **Check mobile responsiveness**
4. **Verify database connections**

## 🧪 **Testing Your Deployment**

### Test These URLs:
- **Homepage**: `https://your-domain.vercel.app/`
- **About**: `https://your-domain.vercel.app/about`
- **Contact**: `https://your-domain.vercel.app/contact`
- **Join**: `https://your-domain.vercel.app/join`
- **Blogs**: `https://your-domain.vercel.app/blogs`
- **Testing Tools**:
  - `/test-dashboard` - Health monitoring
  - `/db-test` - Database connectivity
  - `/validation-test` - Form validation

### Test These Features:
- ✅ **Responsive design** on mobile/tablet/desktop
- ✅ **Contact form** submission
- ✅ **Join form** submission
- ✅ **Newsletter signup**
- ✅ **Database connections**
- ✅ **Error handling**
- ✅ **Loading states**

## 🔍 **Troubleshooting Common Issues**

### Issue 1: Build Fails
**Solution**: Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for missing environment variables
- Verify build command is correct

### Issue 2: Environment Variables Not Working
**Solution**: 
- Ensure variables start with `REACT_APP_`
- Redeploy after adding variables
- Check variable names match exactly

### Issue 3: Database Connection Fails
**Solution**:
- Verify Supabase URL and key are correct
- Check Supabase project is active
- Ensure RLS policies allow public access

### Issue 4: Images Not Loading
**Solution**:
- Check image URLs are accessible
- Verify image paths are correct
- Ensure images are in the `public` folder

## 📊 **Performance Monitoring**

### Built-in Tools:
- **Performance Monitor**: Bottom-right corner of your site
- **Test Dashboard**: `/test-dashboard`
- **Vercel Analytics**: Available in dashboard

### Key Metrics to Monitor:
- Page load time (< 3 seconds)
- First Contentful Paint (< 1.5 seconds)
- Largest Contentful Paint (< 2.5 seconds)
- Cumulative Layout Shift (< 0.1)

## 🔄 **Updating Your Deployment**

### For Future Updates:
1. **Push changes to your Git repository**
2. **Vercel will automatically redeploy**
3. **Or manually trigger redeploy** in dashboard

### Manual Redeploy:
```bash
vercel --prod
```

## 📞 **Support Resources**

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **React Deployment Guide**: [reactjs.org/docs/deployment.html](https://reactjs.org/docs/deployment.html)

---

## 🎉 **Congratulations!**

Your Kenya Women's March website is now live and optimized! 

**Next Steps:**
1. Test all functionality thoroughly
2. Set up monitoring and analytics
3. Configure your custom domain
4. Share your live URL with stakeholders

**Your site is now:**
- ✅ Fully responsive
- ✅ SEO optimized
- ✅ Accessible
- ✅ Performance optimized
- ✅ Error-handled
- ✅ Database connected
- ✅ Production ready 