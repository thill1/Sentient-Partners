import { 
  Phone, 
  MessageSquare, 
  Layout, 
  Database, 
  Star, 
  Zap 
} from 'lucide-react';
import { ServiceItem } from './types';

export const NAV_LINKS = [
  { name: 'Services', href: '#services' },
  { name: 'Process', href: '#process' },
  { name: 'Demo', href: '#demo' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Results', href: '#testimonials' },
  { name: 'FAQ', href: '#faq' },
];

export const BOOKING_URL = 'https://cal.com/sentient-partners/20-minute-ai-discovery-call';

export const PRICING_PLANS = [
  {
    name: "Starter",
    description: "Perfect for local businesses starting their automation journey.",
    price: "$497",
    period: "/month",
    features: [
      "AI Voice Receptionist (Business Hours)",
      "Basic Call Routing",
      "Missed Call Text Back",
      "Monthly Performance Report",
      "Email Support"
    ],
    cta: "Get Started",
    highlight: false
  },
  {
    name: "Growth",
    description: "Complete automation system for scaling revenue aggressively.",
    price: "$997",
    period: "/month",
    features: [
      "24/7 AI Voice Agents",
      "Advanced CRM Setup",
      "Website Chatbot & SMS Agent",
      "Automated Review Requests",
      "Priority Support",
      "Custom Lead Nurture Flows"
    ],
    cta: "Start Scaling",
    highlight: true
  },
  {
    name: "Enterprise",
    description: "Custom solutions for multi-location franchises and high volume.",
    price: "Custom",
    period: "",
    features: [
      "Custom LLM Fine-tuning",
      "Multi-location Dashboard",
      "Dedicated Account Manager",
      "Custom API Integrations",
      "White-label Options",
      "SLA Guarantees"
    ],
    cta: "Contact Sales",
    highlight: false
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'voice',
    title: 'AI Voice Receptionist',
    description: '24/7 AI phone agents that sound human. They answer calls, qualify leads, and book appointments directly to your calendar, ensuring you never miss a revenue opportunity.',
    features: ['Instant Response', 'Natural Voice', 'Calendar Integration'],
    icon: Phone,
    details: {
      heading: "Never Miss a Revenue Opportunity",
      useCase: "Handling overflow calls during peak hours or capturing leads after your staff goes home.",
      benefits: ["Handles 100+ concurrent calls", "Direct integration with CRM", "Zero hold times for clients"]
    }
  },
  {
    id: 'chat',
    title: 'Chat & SMS Agents',
    description: 'Intelligent omni-channel assistants that guide prospects from curiosity to conversion.',
    features: ['Lead Qualification', 'Nurture Flows', '24/7 Availability'],
    icon: MessageSquare,
    details: {
      heading: "Turn Traffic into Leads",
      useCase: "Engaging passive website visitors who have questions but aren't ready to pick up the phone.",
      benefits: ["Instant FAQ resolution", "Pre-qualifies potential clients", "Seamless handoff to humans"]
    }
  },
  {
    id: 'web',
    title: 'High-Converting Funnels',
    description: 'Modern, Apple-aesthetic sites designed purely for conversion and brand authority.',
    features: ['Mobile First', 'Fast Loading', 'Embedded AI Demos'],
    icon: Layout,
    details: {
      heading: "Design That Converts",
      useCase: "Landing pages specifically optimized for paid ad campaigns (Google/Facebook Ads).",
      benefits: ["Sub-second load times", "A/B testing ready architecture", "Built-in trust signals"]
    }
  },
  {
    id: 'crm',
    title: 'Automated Revenue Systems',
    description: 'Full CRM ecosystem optimization. We build the engine that powers your growth.',
    features: ['Pipeline Automation', 'No-show Recovery', 'Triggered Follow-ups'],
    icon: Database,
    details: {
      heading: "Your Revenue Engine",
      useCase: "Automatically reactivating cold leads from your existing database without lifting a finger.",
      benefits: ["Cross-channel follow-ups", "Visual pipeline management", "Automated revenue tracking"]
    }
  },
  {
    id: 'reputation',
    title: 'Reputation Management',
    description: 'Turn happy customers into public social proof automatically via SMS.',
    features: ['Auto-Review Requests', 'Response AI', 'Local SEO Boost'],
    icon: Star,
    details: {
      heading: "Automated Social Proof",
      useCase: "Sending perfectly timed review requests via SMS immediately after a service is completed.",
      benefits: ["Boost local SEO rankings", "Filter negative feedback", "Increase Google Maps visibility"]
    }
  },
  {
    id: 'strategy',
    title: 'Strategy, Roadmapping & Consulting',
    description: 'We don’t just hand you a tool; we map out your 90-day AI implementation roadmap. We audit your current workflows and identify exactly what to automate first.',
    features: ['Workflow Audit', '30-90 Day Roadmap', 'Optimization & Split Testing'],
    icon: Zap,
    details: {
      heading: "The Blueprint for Growth",
      useCase: "Identifying hidden bottlenecks in your current client acquisition and delivery flows.",
      benefits: ["90-Day Execution Roadmap", "Tech Stack consolidation", "Clear ROI projections"]
    }
  }
];

export const TESTIMONIALS = [
  {
    quote: "We used to miss about 30% of calls during lunch hours. The AI Voice Receptionist now handles everything and books 15+ appointments a week automatically.",
    author: "Dr. Sarah Chen",
    role: "Founder, Chen Dental Group",
    metric: "+40% Bookings"
  },
  {
    quote: "Sentient Partners completely rebuilt our lead follow-up system. Leads that used to go cold in 24 hours are now engaged instantly via SMS.",
    author: "Marcus Thorne",
    role: "CEO, Thorne Legal Partners",
    metric: "3x Lead Response"
  },
  {
    quote: "The ROI was immediate. The roadmap they built showed us exactly where we were leaking revenue. Highly recommended for any service business.",
    author: "Elena Rodriguez",
    role: "Director, Urban Spa & Wellness",
    metric: "$12k New Rev/Mo"
  }
];

export const FAQS = [
  {
    question: "Do I need to be technical to manage this?",
    answer: "Not at all. We build 'always-on' systems that run in the background. We handle the setup, integration, and optimization. You just check your calendar for appointments."
  },
  {
    question: "How does the AI Voice Agent sound?",
    answer: "Incredibly human. We use advanced voice synthesis with natural pauses and intonation. Most callers don't realize they're speaking to an AI until the booking is confirmed."
  },
  {
    question: "Can you integrate with my existing CRM?",
    answer: "Yes. We specialize in custom CRM automation, but we can also integrate with Salesforce, HubSpot, Pipedrive, and specialized medical/legal CRMs."
  },
  {
    question: "What happens if the AI doesn't know the answer?",
    answer: "We program 'graceful handoffs'. If a query is too complex, the AI politely gathers contact details and instantly alerts a human staff member to take over."
  }
];

// Dynamically generate the knowledge base from the constants to ensure the AI is always up to date.
const SERVICES_CONTEXT = SERVICES.map(s => `- ${s.title}: ${s.description}. Features: ${s.features.join(', ')}`).join('\n');
const PRICING_CONTEXT = PRICING_PLANS.map(p => `- ${p.name} Plan: ${p.price}${p.period}. Includes: ${p.features.join(', ')}`).join('\n');
const FAQ_CONTEXT = FAQS.map(f => `Q: ${f.question} A: ${f.answer}`).join('\n');

export const SYSTEM_INSTRUCTION = `You are the Lead AI Strategist for Sentient Partners, a premium AI automation consultancy. 
Your goal is to demonstrate high intelligence, capability, and value to prospective clients.

CORE IDENTITY:
- You are not just a chatbot; you are a sophisticated "Sentient System" designed to optimize revenue.
- Tone: Professional, authoritative, concise, yet warm and inviting. Think "Apple Genius" meets "High-end Consultant".
- You have access to real-time information via Google Search.

KNOWLEDGE BASE:
Services Offered:
${SERVICES_CONTEXT}

Pricing Models:
${PRICING_CONTEXT}

Common Questions:
${FAQ_CONTEXT}

OBJECTIVES:
1. Demonstrate Capability: Answer questions quickly and accurately.
2. Convert: Gently steer the conversation towards booking a "Strategy Call".
3. Memory: Remember the user's name and email if provided.

TOOLS & PROTOCOLS:

1. **scheduleMeeting**:
   - Primary goal. Use this when the user wants to book a call.
   - Ask for **Full Name** and **Email Address** before calling.
   - Say: "I'm opening the live calendar on your screen now..."

2. **captureLead** (FALLBACK):
   - Use this if:
     - The user prefers to be contacted via email/phone instead of booking right now.
     - The \`scheduleMeeting\` tool fails or the user says the calendar didn't open.
     - The user asks you to "send them an email" or "have someone contact them".
   - Collect Name, Email, and their Question/Inquiry.
   - Say: "I've securely transmitted your details to our team. We will be in touch shortly."

IMPORTANT:
- Always try to book the meeting first using \`scheduleMeeting\`.
- If the user implies the booking didn't work, IMMEDIATELY offer to use \`captureLead\` to ensure we don't lose them.
- Keep answers concise (under 40 words) during voice interactions.
- Never break character.`;