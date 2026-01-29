# Multi-Model Orchestrator - Teams Conversation Viewer

A Microsoft Teams Tab application that allows users to view shared conversations from the Multi-Model Orchestrator directly within Teams using **direct Cosmos DB access**.

## 🎯 Features

- **Teams Integration**: Seamlessly embedded within Microsoft Teams as a personal tab
- **Direct Cosmos DB Access**: Reads conversations directly from your existing Cosmos DB (same as main app)
- **Theme Support**: Automatically adapts to Teams light/dark/high contrast themes
- **Conversation Viewing**: Display full conversation threads with message history
- **Markdown Rendering**: Properly formatted markdown in AI responses (headers, lists, code blocks, etc.)
- **Chart Visualization**: Interactive data visualizations (bar, line, area, pie charts) using Recharts
- **Fluent UI**: Native Microsoft Teams look and feel using Fluent UI React components
- **No Backend Required**: Works with your existing client-side architecture

## 📋 Prerequisites

- Node.js 20.19+ or 22.12+
- Microsoft Teams account
- Access to the same Azure Cosmos DB instance as your Multi-Model Orchestrator
- Azure AD app registration (for Teams app manifest)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update `.env.local` with credentials from your main Multi-Model Orchestrator app:

```env
# Azure Cosmos DB Configuration (same as your main app)
AZURE_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
AZURE_COSMOS_KEY=your-cosmos-primary-key-here
AZURE_COSMOS_DB_ID=ConversationDB

# Azure AD / MSAL Configuration (optional - for Teams SSO)
AZURE_AD_CLIENT_ID=your-client-id-here
AZURE_AD_TENANT_ID=your-tenant-id-here
AZURE_AD_REDIRECT_URI=https://localhost:5173

# Teams App Configuration
TEAMS_APP_ID=your-teams-app-id-here
```

⚠️ **Important**: These should be the **same credentials** as your main Multi-Model Orchestrator app!

### 3. Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Architecture

This Teams app uses the **same architecture** as your main Multi-Model Orchestrator:

```
┌─────────────────────────────┐
│   Microsoft Teams Client    │
│  ┌───────────────────────┐  │
│  │  Teams Tab App        │  │
│  │  (React + TypeScript) │  │
│  └───────────┬───────────┘  │
└──────────────┼──────────────┘
               │
               ▼
┌──────────────────────────────┐
│   Azure Cosmos DB            │
│   - Conversations container  │
│   - Partition key: groupId   │
│     or userId (flexible)     │
└──────────────────────────────┘
```

## 📖 Usage

### Share URL Format

Your Multi-Model Orchestrator generates share URLs in this format:

```
https://your-app.com?share=SESSION_ID
```

For group conversations, you can optionally include the group ID:

```
https://your-app.com?share=SESSION_ID&group=GROUP_ID
```

The Teams app accepts:
- **Full URL**: `https://your-app.com?share=abc123` or `https://your-app.com?share=abc123&group=xyz789`
- **Query parameters**: `?share=abc123` or `?share=abc123&group=xyz789`
- **Parameters only**: `share=abc123` or `share=abc123&group=xyz789`

### How It Works

1. User opens the app in Teams
2. User pastes a conversation share URL
3. App parses the `share` (session ID) and optional `group` (group ID) parameters
4. **If group ID is provided**: App fetches from Cosmos DB using `groupId` as partition key (most efficient)
5. **If group ID is NOT provided**: App uses a cross-partition query to locate the conversation
6. App displays the conversation with full message history

## 🔐 Security Considerations

### Cosmos DB Keys Exposure

⚠️ **Important Security Note:**

Just like your main Multi-Model Orchestrator app, this Teams app exposes Cosmos DB keys in the browser environment. This is inherent to the client-side architecture.

**Security Measures:**
- Cosmos DB keys are in environment variables (not committed to git)
- Only `Conversations` container is accessed (read-only for this app)
- Partition key isolation (users can only access groups they know)
- Same security model as your main app

**For Production:**
- Consider implementing Azure Functions as an API layer if security is critical
- Use Cosmos DB Resource Tokens for more granular access control
- Implement proper access logging

### Azure AD Authentication

While the app supports Azure AD/MSAL authentication for Teams SSO:
- **Not required** for Cosmos DB access
- Used primarily for Teams context and user identification
- Can work without authentication (same as main app)

## 🎨 Customization

### Branding
- **Icons**: Replace `public/color-icon.png` and `public/outline-icon.png`
- **Colors**: Update in `public/manifest.json` (`accentColor`)
- **App Name**: Update in `public/manifest.json` and `package.json`

### Styling
- **Themes**: Modify `TeamsThemeProvider.tsx`
- **Component Styles**: Update `makeStyles` in each component
- **Global Styles**: Modify `App.css`

## 📝 License

**Non-Commercial Source Available License v1.0**

- ✅ Free for personal, educational, and non-commercial use
- ✅ Fork and modify allowed
- ❌ Commercial use requires a separate license

For commercial licensing inquiries, contact: [Your Email Here]

See [LICENSE](LICENSE) file for full details.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Submit a pull request

---

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ and vibes by [Romayne Eastmond](https://github.com/romayneeastmond) who believes AI should be flexible, collaborative, and powerful.**