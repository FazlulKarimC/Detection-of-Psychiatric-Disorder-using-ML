# Psychiatric Disorder Detection - Frontend

A modern, accessible Next.js frontend for the mental health screening application based on the DASS-42 questionnaire.

## 🌟 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessible UI**: Follows WCAG guidelines for accessibility
- **Real-time Validation**: Immediate feedback on form completion
- **Progress Tracking**: Visual progress indicator for the 30-question assessment
- **Result Visualization**: Clear presentation of screening results with confidence scores
- **Probability Distribution**: Visual breakdown of all severity class probabilities

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 14+](https://nextjs.org) | React framework with App Router |
| [TypeScript](https://typescriptlang.org) | Type safety and better DX |
| [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) | Styling with CSS variables |
| [Geist Font](https://vercel.com/font) | Modern, readable typography |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Backend API running (see main repository README)

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
# API endpoint (development)
NEXT_PUBLIC_API_URL=http://localhost:8000

# API endpoint (production - update with your deployed backend URL)
# NEXT_PUBLIC_API_URL=https://your-backend.run.app
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── page.tsx          # Main questionnaire page
│   ├── layout.tsx        # Root layout with metadata
│   ├── globals.css       # Global styles and CSS variables
│   └── favicon.ico       # App icon
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Styling

The application uses a custom CSS design system with:

- **CSS Variables** for consistent theming
- **Dark mode support** (follows system preference)
- **Smooth transitions** and micro-animations
- **Color-coded severity levels**:
  - 🟢 None (Green)
  - 🟡 Mild (Yellow)
  - 🟠 Moderate (Orange)  
  - 🔴 Severe (Red)

## 📱 Components

### Questionnaire Flow

1. **Welcome Screen**: Introduction and disclaimers
2. **Question Cards**: 30 questions with 4-point response scale
3. **Progress Bar**: Visual indicator of completion
4. **Results Display**: Prediction with confidence and recommendations

### Response Scale

| Value | Description |
|-------|-------------|
| 1 | Did not apply to me at all |
| 2 | Applied to me to some degree, or some of the time |
| 3 | Applied to me to a considerable degree, or a good part of the time |
| 4 | Applied to me very much, or most of the time |

## 🔗 API Integration

The frontend communicates with the FastAPI backend:

```typescript
// Example API call
const response = await fetch(`${API_URL}/predict`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    q1: 2, q2: 1, q3: 3, // ... all 30 responses
  }),
});

const result = await response.json();
// {
//   prediction: "Mild",
//   severity_level: 1,
//   confidence: 0.85,
//   probabilities: { None: 0.10, Mild: 0.85, Moderate: 0.04, Severe: 0.01 },
//   description: "Mild indicators detected..."
// }
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = Your deployed backend URL
5. Deploy

### Self-Hosting

```bash
# Build for production
npm run build

# Start production server
npm start
```

## ⚠️ Disclaimer

This application is for **educational and informational purposes only**. It is NOT a medical diagnosis tool. If you are experiencing mental health concerns, please consult a qualified mental health professional.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [DASS-42 Questionnaire](http://www2.psy.unsw.edu.au/dass/)

---

Part of the [Psychiatric Disorder Detection Project](../README.md)
