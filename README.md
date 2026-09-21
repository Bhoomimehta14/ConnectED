# ConnectED - Campus Networking Platform 🎓

A smart platform that helps students discover and join relevant campus clubs, project teams, and faculty-led initiatives based on their interests, skills, and academic goals.

## Features ✨

- **Smart Discovery Feed** - Social media-style feed for campus activities
- **Club Registration** - Detailed club information, leadership, and positions
- **Event Registration** - Comprehensive event details with pricing and incentives
- **AI Assistant (UniBuddy)** - Help with SOPs, tips, and campus guidance
- **Portfolio Management** - Track interested clubs and activities
- **Inbox System** - Connect with peers and club communications
- **Gamification Hub** - Educational games and skill development

## Tech Stack 🛠️

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Glassmorphic Design
- **Storage**: LocalStorage for demo data
- **Deployment**: Vercel (Static Site)

## Quick Start 🚀

### Local Development
```bash
# Clone the repository
git clone https://github.com/Bhoomimehta14/ConnectED.git
cd ConnectED

# Start local development server
npm run dev
# or
python -m http.server 3000
```

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect this as a static site
3. Deploy with default settings

The `vercel.json` configuration ensures proper routing:
- Root path `/` redirects to login page
- All static assets are served correctly

## Project Structure 📁

```
hackathon/
├── connected-login.html          # Entry point / Login page
├── connected-profile-setup.html  # Profile creation
├── connected-discovery.html      # Main feed & discovery
├── connected-portfolio.html      # User's interested clubs
├── connected-inbox.html          # Messages & communications
├── connected-ai-helper.html      # UniBuddy AI assistant
├── connected-gamification.html   # Educational games
├── connected-profile.html        # User profile & settings
├── connected-logo.svg           # App logo
├── index.html                   # Root redirect page
├── vercel.json                  # Vercel configuration
└── package.json                 # Project metadata
```

## Design System 🎨

### Color Palette
- **Primary**: Teal (#14B8A6), Turquoise (#06B6D4)
- **Secondary**: Green (#10B981), Coral (#F87171)
- **Accent**: Yellow (#FACC15), Blue (#3B82F6), Purple (#7C3AED)
- **Background**: Dark Navy (#0A1628) to (#1A2332)

### UI Elements
- **Glassmorphic Cards**: backdrop-filter with blur effects
- **Gradient Buttons**: Multi-color gradients with hover effects
- **Grid Backgrounds**: Subtle overlay patterns
- **Smooth Animations**: CSS transitions and keyframes

## Navigation Structure 🧭

**Main Navigation:**
- Discovery (Feed)
- Portfolio (Interested Clubs)
- AI Helper (UniBuddy)

**Dropdown Menu (⋮):**
- Profile
- Inbox
- Games
- Logout

## Key Features Detail 📋

### Club Registration
- Club description and statistics
- Current leadership with real names
- Open positions with requirements
- Application form with SOP
- Position preference selection

### Event Registration
- Event details (date, venue, duration)
- Pricing information and early bird offers
- Incentives (prizes, certificates, networking)
- Speaker information
- Registration form with team details

### AI Assistant (UniBuddy)
- SOP writing assistance
- Quick prompts for different clubs
- Pro tips with glassmorphic design
- Integration across the platform

## Demo Data 💾

The platform uses localStorage for demo purposes with:
- User profiles and authentication
- Club data and memberships
- Event registrations
- Message threads
- Game progress

## Contributing 🤝

This is a hackathon POC. For improvements:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test locally
5. Submit pull request

## Deployment Status 🔴

Ready for Vercel deployment as a static site.

**Live Demo**: [Deploy to Vercel](https://vercel.com/new)

## Author 👩‍💻

**Bhoomi Mehta**
- Email: bhoomime14@gmail.com
- GitHub: [@bhoomime14](https://github.com/bhoomime14)

## License 📄

MIT License - see LICENSE file for details.

---

Built with ❤️ for campus networking and student engagement.
