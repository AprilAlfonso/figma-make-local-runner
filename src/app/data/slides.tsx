import { useState, ReactNode } from 'react';
import { Card } from '../components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Copy, Check } from 'lucide-react';
import { CardGridWrapper } from '../components/CardGridWrapper';
import { useSlideNav } from '../contexts/SlideNavContext';

// IBM Carbon v11 color palette used throughout:
// Purple-70: #6929c4  Purple-10: #f6f2ff  Purple-50: #a56eff
// Teal-60:   #007d79  Teal-10:   #d9fbfb
// Orange-60: #ba4e00  Orange-10: #fff2e8  Orange-50: #eb6200
// Blue-70:   #0043ce  Blue-10:   #edf5ff  Blue-50:   #4589ff
// Magenta-70:#9f1853  Magenta-10:#fff0f7  Magenta-50:#ee5396
// WarmGray-70:#565151 WarmGray-10:#f7f3f2
// Red-60:    #da1e28  Red-10:    #fff1f1
// Green-60:  #198038  Green-10:  #defbe6

// ─── CopyCodeBlock component ──────────────────────────────────────────────────

function CopyCodeBlock({ prompt, output }: { prompt: string; output: string }) {
  const [copied, setCopied] = useState(false);
  const fullText = `Prompt:\n${prompt}\n\nExpected Output:\n${output}`;
  const promptOnly = prompt.replace(/^"|"$/g, '');

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(promptOnly).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = promptOnly;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (_) {} finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className="relative group">
      <pre className="rounded bg-[#f4f4f4] border border-[#e0e0e0] px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap font-mono text-foreground pr-10">{fullText}</pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-[#e0e0e0] hover:bg-[#c6c6c6]"
        title="Copy prompt"
      >
        {copied
          ? <Check size={12} className="text-[#198038]" />
          : <Copy size={12} className="text-[#525252]" />
        }
      </button>
    </div>
  );
}

// ─── StepCard component ───────────────────────────────────────────────────────

function StepCard({ step }: { step: { num: string; title: string; desc: string; prompt: string; review: string; } }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(step.prompt).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = step.prompt;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (_) {} finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-[#defbe6] text-[#198038] flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
        {step.num}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">
          {step.title}
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-1.5">
          {step.desc}
        </div>
        <div className="relative group mb-1.5">
          <div className="bg-[#f4f4f4] border border-[#e0e0e0] rounded px-3 py-2 pr-9">
            <div className="text-[10px] font-medium text-[#525252] uppercase mb-1">Prompt</div>
            <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-foreground">{step.prompt}</pre>
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-[#e0e0e0] hover:bg-[#c6c6c6]"
            title="Copy prompt"
          >
            {copied
              ? <Check size={12} className="text-[#198038]" />
              : <Copy size={12} className="text-[#525252]" />
            }
          </button>
        </div>
        <div className="flex items-start gap-1.5 bg-[#defbe6] border border-[#a7f0ba] rounded px-2.5 py-1.5">
          <span className="text-xs font-medium text-[#198038] uppercase whitespace-nowrap">Review:</span>
          <span className="text-xs text-[#0e6027] leading-relaxed">{step.review}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Slide types ──────────────────────────────────────────────────────────────

export interface Slide {
  id: string;
  badge: {
    text: string;
    color: string;
    bgColor: string;
  };
  title: string;
  subtitle: string;
  Content: () => ReactNode;
}

// ─── OverviewContent ──────────────────────────────────────────────────────────

const TOPIC_SLIDE_INDEX: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 6,
};

const OVERVIEW_TOPICS = [
  { num: '1', name: 'Four pillars',       desc: 'Be specific, add detail, give context, iterate.', color: '#a56eff', bg: '#f6f2ff' },
  { num: '2', name: 'Format control',     desc: 'Bullets, tables, steps, pseudocode and more.',    color: '#007d79', bg: '#d9fbfb' },
  { num: '3', name: 'Break it down',      desc: 'Smaller tasks = better output.',                  color: '#0072c3', bg: '#e5f6ff' },
  { num: '4', name: 'Iterate',            desc: 'Treat prompting as a dialogue, not a one-shot.',  color: '#4589ff', bg: '#edf5ff' },
  { num: '5', name: 'Prompt engineering', desc: 'Use AI to optimize your own prompts.',            color: '#ee5396', bg: '#fff0f7' },
];

function OverviewContent() {
  const { goToSlide } = useSlideNav();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
      {OVERVIEW_TOPICS.map((pillar) => (
        <Card
          key={pillar.num}
          onClick={() => goToSlide(TOPIC_SLIDE_INDEX[pillar.num])}
          className="p-4 gap-0 cursor-pointer transition-shadow hover:shadow-md"
          style={{ borderTopWidth: '2px', borderTopColor: pillar.color, backgroundColor: pillar.bg }}
        >
          <div className="text-xs font-medium text-muted-foreground mb-1">
            Topic {pillar.num}
          </div>
          <div className="text-base font-medium text-foreground mb-1.5">
            {pillar.name}
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {pillar.desc}
          </div>
          <div className="mt-2 text-xs font-medium" style={{ color: pillar.color }}>
            View slides →
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── S1Content — Four pillars ─────────────────────────────────────────────────

const PILLARS = [
  {
    num: '1', name: 'Be specific', desc: 'State exactly what you want — content, tone, audience, purpose, word count.',
    examples: [
      { label: 'Example 1', badLabel: 'VAGUE', badText: '"Write about customer service"', goodLabel: 'SPECIFIC', goodText: '"Write a 300-word guide on handling angry customers in retail, including 3 de-escalation techniques and appropriate phrases to use"' },
      { label: 'Example 2', badLabel: 'VAGUE', badText: '"Help me with my presentation"', goodLabel: 'SPECIFIC', goodText: '"Create an outline for a 15-minute presentation on Q4 sales results for executive leadership, highlighting 3 key achievements and 2 areas for improvement"' },
    ],
  },
  {
    num: '2', name: 'Technical details', desc: 'Include specs, formats, constraints, and parameters that affect output quality.',
    examples: [
      { label: 'Example 1', badLabel: 'NO DETAILS', badText: '"Create a report template"', goodLabel: 'WITH DETAILS', goodText: '"Create a monthly report template in markdown with sections for: Executive Summary (150 words max), Key Metrics (table format), Action Items (numbered list), and Next Steps (bullets)"' },
      { label: 'Example 2', badLabel: 'NO DETAILS', badText: '"Write code for a form"', goodLabel: 'WITH DETAILS', goodText: '"Write HTML5 code for a contact form with fields for name (text, required), email (email validation, required), and message (textarea, 500 character limit). Include proper labels and placeholder text."' },
    ],
  },
  {
    num: '3', name: 'Give context', desc: 'Explain the background, purpose, and audience so the AI can tailor the response.',
    examples: [
      { label: 'Example 1', badLabel: 'NO CONTEXT', badText: '"Draft an email declining a meeting"', goodLabel: 'WITH CONTEXT', goodText: '"Draft an email declining a vendor meeting — we\'ve already chosen a different supplier, but want to keep the door open for future work"' },
      { label: 'Example 2', badLabel: 'NO CONTEXT', badText: '"Explain cloud computing"', goodLabel: 'WITH CONTEXT', goodText: '"Explain cloud computing to a group of small business owners (no technical background) considering moving from physical servers. Focus on cost benefits and security concerns."' },
    ],
  },
  {
    num: '4', name: 'Iterate', desc: "Refine and improve through dialogue — don't expect perfection on the first try.",
    examples: [
      { label: 'Example 1', badLabel: 'FIRST PROMPT', badText: '"Write a welcome email for new employees"', goodLabel: 'ITERATION', goodText: '"Make the tone more casual and friendly. Add a section about our company culture values. Reduce the length to 200 words."' },
      { label: 'Example 2', badLabel: 'FIRST PROMPT', badText: '"Create a checklist for project kickoff"', goodLabel: 'ITERATION', goodText: '"Add time estimates for each item. Reorganize in order of priority. Include a section specifically for remote team considerations."' },
    ],
  },
];

function S1Content() {
  return (
    <div className="space-y-4">
      <CardGridWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PILLARS.map((pillar) => (
          <div key={pillar.num} className="rounded-md overflow-hidden border" style={{ borderColor: '#8a3ffc' }}>
            <div data-card-header className="p-4" style={{ backgroundColor: '#f6f2ff' }}>
              <div className="text-xs font-medium mb-1" style={{ color: '#8a3ffc' }}>
                Pillar {pillar.num}
              </div>
              <div className="text-base font-medium mb-1.5" style={{ color: '#6929c4' }}>
                {pillar.name}
              </div>
              <div className="text-sm leading-relaxed" style={{ color: '#6929c4' }}>
                {pillar.desc}
              </div>
            </div>
            <Accordion type="single" collapsible style={{ borderTop: '1px solid #8a3ffc' }}>
              {pillar.examples.map((ex, i) => (
                <AccordionItem key={i} value={`p${pillar.num}-ex${i}`}>
                  <AccordionTrigger className="px-4 text-xs font-medium text-foreground hover:no-underline py-3">
                    {ex.label}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3">
                    <div className="space-y-2">
                      <div className="rounded overflow-hidden">
                        <div className="bg-[#fff1f1] text-[#da1e28] text-[10px] font-medium px-2 py-0.5">{ex.badLabel}</div>
                        <div className="border border-[#da1e28] border-t-0 px-2 py-1.5 text-xs text-muted-foreground leading-relaxed bg-transparent">{ex.badText}</div>
                      </div>
                      <div className="rounded overflow-hidden">
                        <div className="bg-[#defbe6] text-[#198038] text-[10px] font-medium px-2 py-0.5">{ex.goodLabel}</div>
                        <div className="border border-[#198038] border-t-0 px-2 py-1.5 text-xs text-foreground leading-relaxed bg-transparent">{ex.goodText}</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </CardGridWrapper>
    </div>
  );
}

// ─── S3Content — Format control ───────────────────────────────────────────────

const FORMATS = [
  {
    num: '1', name: 'Bullet points', desc: 'Best for quick scanning, presentations, and summaries.',
    examples: [
      {
        label: 'Example 1',
        prompt: `"Summarize the key benefits of remote work in 5 bullet points, each with one sentence explanation and a relevant statistic if available."`,
        output: `• Increased productivity - Studies show 77% of remote workers report higher productivity with fewer office distractions\n• Cost savings - Companies save an average of $11,000 per year per remote employee\n[etc.]`,
      },
      {
        label: 'Example 2',
        prompt: `"List 4 common mistakes in email marketing with a brief explanation of why each is problematic and a quick fix."`,
        output: `• Unclear subject lines - Recipients delete emails they don't understand immediately. Fix: Use specific, benefit-driven subjects\n• No mobile optimization - 60% of emails are opened on mobile devices. Fix: Use responsive design templates\n[etc.]`,
      },
    ],
  },
  {
    num: '2', name: 'Tables', desc: 'Great for comparisons, structured data, and feature grids.',
    examples: [
      {
        label: 'Example 1',
        prompt: `"Compare project management tools Asana, Trello, and Monday.com in a table. Include columns for: Pricing, Best For, Key Features, and Learning Curve."`,
        output: `| Tool   | Pricing           | Best For                     | Key Features | Learning Curve |\n| Asana  | Free-$24.99/user  | Teams w/ complex workflows   | ...          | Medium         |\n[etc.]`,
      },
      {
        label: 'Example 2',
        prompt: `"Create a comparison table of CSS Grid vs Flexbox with columns for: Primary Use Case, When to Use, Strengths, Limitations, and Browser Support."`,
        output: `| Feature      | CSS Grid                   | Flexbox                       |\n| Primary Use  | Two-dimensional layouts    | One-dimensional layouts       |\n| When to Use  | Complex page layouts       | Navigation bars, card layouts |\n[etc.]`,
      },
    ],
  },
  {
    num: '3', name: 'Step-by-step', desc: 'Ideal for processes, tutorials, and instructional content.',
    examples: [
      {
        label: 'Example 1',
        prompt: `"Provide a 5-step process for onboarding a new client. For each step, include the estimated time and key deliverables."`,
        output: `Step 1: Initial Consultation (1 hour)\n- Review client needs and expectations\n- Deliverable: Completed intake form and project scope document\n\nStep 2: Contract and Agreement (30 minutes)\n[etc.]`,
      },
      {
        label: 'Example 2',
        prompt: `"Break down the process of conducting a performance review into 7 steps. Include what to prepare before each step."`,
        output: `Step 1: Schedule the Meeting (1 week before)\n- Preparation: Send calendar invite, share review template with employee\n- Action: Give employee time to self-assess\n\nStep 2: Gather Performance Data\n[etc.]`,
      },
    ],
  },
  {
    num: '4', name: 'Numbered explanations', desc: 'Useful for ranked items, reasons, or prioritised lists.',
    examples: [
      {
        label: 'Example 1',
        prompt: `"Explain 3 reasons why innerHTML should be avoided in modern JavaScript, followed by a short explanation of each and a code example of what should be used instead."`,
        output: `1. Security Vulnerability (XSS Attacks)\n   Explanation: innerHTML can execute malicious scripts if user input isn't sanitized...\n   Instead use: textContent or createElement()\n   // Bad\n   element.innerHTML = userInput;\n   // Good\n   element.textContent = userInput;\n[etc.]`,
      },
      {
        label: 'Example 2',
        prompt: `"List the 4 most important principles of UI design with a one-sentence explanation and a real-world example of each."`,
        output: `1. Consistency - Users should experience predictable patterns throughout the interface\n   Example: Amazon keeps its "Add to Cart" button in the same location across all product pages\n\n2. Feedback - The system should inform users about what's happening\n[etc.]`,
      },
    ],
  },
  {
    num: '5', name: 'Pseudocode / flowchart', desc: 'Perfect for logic, algorithms, and decision trees.',
    examples: [
      {
        label: 'Example 1',
        prompt: `"Create a flowchart in text format describing the decision process for approving a purchase request in a company."`,
        output: `START: Employee submits purchase request\n\nIs amount < $500?\n  YES → Manager approves → Send to Accounting → END\n  NO  → Continue\n\nIs amount < $5000?\n  YES → Requires Director approval\n  NO  → Requires VP approval\n[etc.]`,
      },
      {
        label: 'Example 2',
        prompt: `"Create pseudocode in the form of code comments describing how to build a user authentication function."`,
        output: `// FUNCTION: authenticateUser(username, password)\n//\n// STEP 1: Validate input\n//   - Check if username and password are not empty\n//   - Return error if validation fails\n//\n// STEP 2: Query database\n//   - Search for user by username\n//   - If user not found, return "Invalid credentials" error\n[etc.]`,
      },
    ],
  },
];

function S3Content() {
  return (
    <div className="space-y-4">
      <CardGridWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {FORMATS.map((format) => (
          <div key={format.num} className="rounded-md overflow-hidden border" style={{ borderColor: '#007d79' }}>
            <div data-card-header className="p-4" style={{ backgroundColor: '#d9fbfb' }}>
              <div className="text-xs font-medium mb-1" style={{ color: '#007d79' }}>
                Format {format.num}
              </div>
              <div className="text-base font-medium mb-1.5" style={{ color: '#007d79' }}>
                {format.name}
              </div>
              <div className="text-sm leading-relaxed" style={{ color: '#007d79' }}>
                {format.desc}
              </div>
            </div>
            <Accordion type="single" collapsible style={{ borderTop: '1px solid #007d79' }}>
              {format.examples.map((ex, i) => (
                <AccordionItem key={i} value={`f${format.num}-ex${i}`}>
                  <AccordionTrigger className="px-4 text-xs font-medium text-foreground hover:no-underline py-3">
                    {ex.label}
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <CopyCodeBlock prompt={ex.prompt} output={ex.output} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </CardGridWrapper>
    </div>
  );
}

// ─── S4Content — Break tasks ──────────────────────────────────────────────────

function S4Content() {
  const [openAccordion, setOpenAccordion] = useState<string>('');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        {/* Col 1: 5 reasons */}
        <div className="flex flex-col">
          <div className="mb-3">
            <div className="text-xs font-medium uppercase tracking-wide" style={{ color: '#0072c3' }}>5 reasons to break down tasks</div>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Breaking things down isn't just about managing complexity — it's about staying in control of the process.</p>
          </div>
          <div className="space-y-2.5">
            {[
              { num: '1', title: 'Manageability', desc: 'smaller tasks are easier to understand, execute, and verify before moving on.' },
              { num: '2', title: 'Progressive learning', desc: 'you understand each piece before building on top of it.' },
              { num: '3', title: 'Issue isolation', desc: 'when something goes wrong, you know exactly which step caused it.' },
              { num: '4', title: 'Quality control', desc: 'review and approve each piece before proceeding to the next.' },
              { num: '5', title: 'Flexibility', desc: 'change direction mid-process based on what each step reveals.' },
            ].map((tip) => (
              <div key={tip.num} className="flex gap-3 items-start">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                  style={{ backgroundColor: '#e5f6ff', color: '#0072c3' }}
                >
                  {tip.num}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{tip.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Wrong+Right pairs */}
        <div className="flex flex-col gap-6">

          <div className={openAccordion === 'right-col2' ? 'hidden' : 'flex flex-col gap-3'}>
            <div className="flex flex-col">
              <div className="text-xs font-medium text-[#da1e28] uppercase tracking-wide mb-2">
                Wrong — all at once
              </div>
              <Card className="overflow-hidden flex flex-col p-0 gap-0">
                <div className="bg-[#fff1f1] text-[#da1e28] text-xs font-medium px-3 py-1">
                  ONE GIANT PROMPT
                </div>
                <div className="p-3 text-sm flex-1">
                  "Create a complete contact form with validation, database storage, email notifications, spam protection, responsive design, and CRM integration."
                </div>
              </Card>
              <div className="text-xs text-muted-foreground leading-relaxed px-1 mt-2">
                Result: overwhelming, errors compound, hard to debug, you don't understand how it works.
              </div>
            </div>
            <Accordion
              type="single"
              collapsible
              value={openAccordion === 'right-col1' ? 'right-col1' : undefined}
              onValueChange={(val) => setOpenAccordion(val ?? '')}
              className="border border-[#a7f0ba] rounded-md overflow-hidden"
            >
              <AccordionItem value="right-col1" className="border-none">
                <AccordionTrigger className="px-3 py-2 text-xs font-medium text-[#198038] uppercase tracking-wide hover:no-underline bg-[#defbe6] hover:bg-[#c3f5d5]">
                  Right — broken down
                </AccordionTrigger>
                <AccordionContent className="px-3 pt-3 pb-3">
                  <div className="space-y-3" onClick={() => setOpenAccordion('')}>
                    {[
                      { num: '1', title: 'HTML structure', desc: 'Basic form fields with semantic HTML5', prompt: 'Create basic HTML structure for a contact form with fields for: name, email, subject, and message. Include proper labels and semantic HTML5.', review: 'Check if the structure looks good, fields are appropriate' },
                      { num: '2', title: 'Styling', desc: 'Responsive CSS matching brand colors', prompt: 'Add CSS to make this form responsive and match our brand colors (blue: #0066CC, gray: #F4F4F4). The form should be centered and max-width 600px.', review: 'Test responsiveness, verify styling' },
                      { num: '3', title: 'Validation', desc: 'JS checks on each field with error messages', prompt: 'Add JavaScript validation that checks: name is not empty, email format is valid, message is at least 10 characters. Display error messages below each field.', review: 'Test validation with various inputs' },
                      { num: '4', title: 'Backend email', desc: 'PHP script with security checks', prompt: 'Create a PHP script that receives the form data and sends an email to admin@company.com with the form contents. Include basic security checks.', review: 'Test email delivery, check security' },
                      { num: '5', title: 'Spam protection', desc: 'Google reCAPTCHA v3', prompt: 'Add Google reCAPTCHA v3 to prevent spam submissions.', review: 'Test spam protection' },
                    ].map((step) => (
                      <StepCard key={step.num} step={step} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className={openAccordion === 'right-col1' ? 'hidden' : 'flex flex-col gap-3'}>
            <div className="flex flex-col">
              <div className="text-xs font-medium text-[#da1e28] uppercase tracking-wide mb-2">
                Wrong — all at once
              </div>
              <Card className="overflow-hidden flex flex-col p-0 gap-0">
                <div className="bg-[#fff1f1] text-[#da1e28] text-xs font-medium px-3 py-1">
                  ONE GIANT PROMPT
                </div>
                <div className="p-3 text-sm flex-1">
                  "Create a complete marketing campaign for our new product including social media posts, email sequences, landing page copy, ad copy, targeting strategy, budget allocation, and analytics setup."
                </div>
              </Card>
              <div className="text-xs text-muted-foreground leading-relaxed px-1 mt-2">
                Result: Generic content, missed opportunities, unclear strategy.
              </div>
            </div>
            <Accordion
              type="single"
              collapsible
              value={openAccordion === 'right-col2' ? 'right-col2' : undefined}
              onValueChange={(val) => setOpenAccordion(val ?? '')}
              className="border border-[#a7f0ba] rounded-md overflow-hidden"
            >
              <AccordionItem value="right-col2" className="border-none">
                <AccordionTrigger className="px-3 py-2 text-xs font-medium text-[#198038] uppercase tracking-wide hover:no-underline bg-[#defbe6] hover:bg-[#c3f5d5]">
                  Right — broken down
                </AccordionTrigger>
                <AccordionContent className="px-3 pt-3 pb-3">
                  <div className="space-y-3" onClick={() => setOpenAccordion('')}>
                    {[
                      { num: '1', title: 'Target audience', desc: "Define who you're marketing to", prompt: 'Help me define the target audience for our new productivity app. Ask me questions about our current users and ideal customers.', review: 'Ensure audience definition is accurate' },
                      { num: '2', title: 'Pain points', desc: 'Identify key problems your product solves', prompt: 'Based on [target audience from Step 1], identify 5 key pain points our productivity app solves. Frame each as a problem statement.', review: 'Verify these align with product features' },
                      { num: '3', title: 'Value propositions', desc: 'Craft compelling benefit statements', prompt: 'Create 3 value proposition statements, each highlighting a different benefit for [target audience]. Make them concise and compelling.', review: 'Choose the strongest one to build on' },
                      { num: '4', title: 'Social media posts', desc: 'LinkedIn content for a specific segment', prompt: 'Using [chosen value proposition], write 5 social media posts for LinkedIn targeting [specific segment]. Include relevant hashtags.', review: 'Adjust tone, test message' },
                      { num: '5', title: 'Email sequence', desc: '3-part welcome series', prompt: 'Now create a 3-email welcome sequence that expands on [value prop]. Email 1: Introduction, Email 2: Key Feature Deep Dive, Email 3: Success Story + CTA.', review: 'Test flow and timing' },
                      { num: '6', title: 'Analytics framework', desc: 'Track performance metrics', prompt: 'Design a simple analytics framework to track: email open rates, click-through rates, and conversion rates. Provide benchmarks for each.', review: 'Ensure we can actually track these metrics' },
                    ].map((step) => (
                      <StepCard key={step.num} step={step} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── S6Content — Iterate ──────────────────────────────────────────────────────

const REFINEMENT_STEPS = [
  { num: '1', title: 'Prompt',   desc: 'Start with a clear but not necessarily perfect request' },
  { num: '2', title: 'Evaluate', desc: 'Review the output against your actual needs' },
  { num: '3', title: 'Revise',   desc: 'Provide feedback — adjust tone, length, structure, examples' },
];

const REFINEMENT_TYPES = [
  { title: 'Adjust tone',                    use: 'More casual, more formal, friendlier' },
  { title: 'Change length',                  use: 'Shorter summary or longer detail' },
  { title: 'Add info',                       use: 'Fill in missing sections or examples' },
  { title: 'Restructure',                    use: 'Reorder, reprioritize, reformat' },
  { title: 'Remove unnecessary details',     use: 'Strip out filler, redundancy, and off-topic content' },
  { title: 'Request specific examples',      use: 'Ask for concrete illustrations or real-world cases' },
  { title: 'Change format or presentation',  use: 'Switch from prose to bullets, table, or steps' },
];

function S6Content() {
  return (
    <div className="space-y-6">
      <div className="space-y-2.5 mb-4">
        {REFINEMENT_STEPS.map((step) => (
          <div key={step.num} className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[#edf5ff] text-[#0043ce] flex items-center justify-center text-xs font-medium flex-shrink-0">
              {step.num}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{step.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Common refinement types
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REFINEMENT_TYPES.map((type, i) => (
            <Card
              key={i}
              className="p-3 gap-0"
              style={{ backgroundColor: '#edf5ff', border: '1px solid #0043ce' }}
            >
              <div className="text-sm font-medium mb-1" style={{ color: '#0043ce' }}>
                {type.title}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: '#0043ce' }}>
                {type.use}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── S7Content — Iteration in action (chat UI) ────────────────────────────────

type ChatTurn = {
  user: { label: string; text: string };
  ai: { label: string; note: string; content: string; isFinal?: boolean };
};

const chatTurns1: ChatTurn[] = [
  {
    user: { label: 'Initial Prompt', text: 'Create a job description for a Marketing Manager position.' },
    ai: { label: 'First Output', note: 'Generic, lacks specificity', content: "Marketing Manager\n\nResponsibilities:\n• Develop marketing strategies\n• Manage marketing team\n• Oversee campaigns\n• Analyze market trends\n\nRequirements:\n• 7+ years of experience\n• Bachelor's degree in Marketing\n• Strong communication skills" },
  },
  {
    user: { label: 'Iteration 1 — Add Specificity', text: 'This is too generic. Our company is a B2B SaaS startup. Add specific requirements for digital marketing, content strategy, and experience with marketing automation tools. Focus on growth-stage company needs.' },
    ai: { label: 'Second Output', note: 'More specific — includes SaaS experience, digital focus', content: "Marketing Manager — B2B SaaS\n\nWhat You'll Do:\n• Lead demand generation & content marketing for our SaaS platform\n• Manage growth across SEO, paid, and content channels\n• Own the marketing automation stack (HubSpot/Marketo)\n• Drive MQL targets through data-driven campaigns\n\nRequirements:\n• 5–7 years in B2B SaaS marketing\n• Hands-on experience with marketing automation tools\n• Strong analytical mindset" },
  },
  {
    user: { label: 'Iteration 2 — Adjust Tone', text: 'Make the tone more appealing to millennial professionals. Emphasize our startup culture, flexibility, and growth opportunities. Remove overly corporate language.' },
    ai: { label: 'Third Output', note: 'More engaging, culture-focused language', content: "Marketing Manager @ [Company] 🚀\n\nWho We're Looking For:\nYou're a data-driven marketer who loves building from scratch. You thrive in fast-paced environments and care about the work you do.\n\nWhat You'll Own:\n• Growth strategy across all digital channels\n• A talented, scrappy marketing team\n• The full marketing automation stack\n• Content that actually converts" },
  },
  {
    user: { label: 'Iteration 3 — Final Touches', text: 'Add a section about our benefits: unlimited PTO, remote-first culture, professional development budget of $2000/year, and equity options. Also, reduce the required years of experience from 7 to 5.' },
    ai: { label: 'Final Output', note: 'Complete, compelling, accurate job description ✓', isFinal: true, content: "Marketing Manager @ [Company]\n\n[Full role description with culture-forward tone...]\n\nWhy You'll Love It Here:\n• Unlimited PTO — we trust you to manage your time\n• Remote-first culture with optional hub offices\n• $2,000/year professional development budget\n• Equity options — grow with us\n\nWhat We're Looking For:\n• 5+ years in B2B SaaS marketing\n• Proven growth track record\n• Passion for building things that matter" },
  },
];

const chatTurns2: ChatTurn[] = [
  {
    user: { label: 'Initial Prompt', text: 'Create a training guide on using our project management software.' },
    ai: { label: 'First Output', note: 'Too basic, lacks detail, not user-friendly', content: "Software Training Guide\n\n1. Introduction\n   - Overview of the software\n   - Key features\n\n2. Getting Started\n   - How to log in\n   - Dashboard overview\n\n3. Basic Functions\n   - Creating projects\n   - Adding tasks\n   - Assigning team members" },
  },
  {
    user: { label: 'Iteration 1 — Add Detail and Structure', text: "This is too high-level. Break down each section into specific steps with screenshot references. Add a 'Common Problems and Solutions' section. The audience is non-technical staff who have never used project management software before." },
    ai: { label: 'Second Output', note: 'More detailed steps, includes troubleshooting, better for beginners', content: 'Section 1: Getting Started\nStep 1: Open your browser → go to [software URL]\nStep 2: Enter your company email → click "Sign In"\nStep 3: You\'ll land on your Dashboard\n[Screenshot ref: Dashboard overview]\n\nCommon Problems & Solutions:\n• Can\'t log in? → Check caps lock or use "Forgot Password"\n• Blank screen? → Refresh or try a different browser\n• Missing projects? → Check you\'re in the right workspace' },
  },
  {
    user: { label: 'Iteration 2 — Add Practical Examples', text: "Good progress. Now add a real-world example that walks through creating a complete project from start to finish. Use a marketing campaign project as the example since that's relatable to most departments." },
    ai: { label: 'Third Output', note: 'Includes practical walkthrough, more engaging', content: 'Section 4: Real-World Walkthrough\nExample: Q4 Social Media Campaign\n\nStep 1: Click "New Project" → select "Campaign" template\nStep 2: Name it "Q4 Social Media Campaign"\nStep 3: Set launch date as the due date\nStep 4: Add tasks — "Write copy", "Design assets", "Schedule posts"\nStep 5: Assign each task to the right team member\nStep 6: Use the Timeline view to spot scheduling conflicts' },
  },
  {
    user: { label: 'Iteration 3 — Improve Learning Flow', text: "Reorganize this so learners can follow along doing the tasks as they read. Add checkboxes at the end of each section. Also, create a 'Quick Reference' one-page cheat sheet that summarizes the most common actions." },
    ai: { label: 'Fourth Output', note: 'Interactive format, includes cheat sheet, ready to use', content: 'Section 1: Getting Started\n☐ Open browser and go to [software URL]\n☐ Enter your company email and password\n☐ Locate the Dashboard and note the main nav\n☐ Explore the left sidebar menu\n\n--- Quick Reference Cheat Sheet ---\n• New Project: Click "+" → New Project\n• Assign Task: Click task → "Assignee" field\n• Set Due Date: Click task → Calendar icon\n• Add Comment: Click task → "Activity" tab' },
  },
  {
    user: { label: 'Iteration 4 — Final Polish', text: "Add estimated time to complete each section. Also include a 'Next Steps' at the end that points to advanced features training." },
    ai: { label: 'Final Output', note: 'Complete, user-friendly training guide with time estimates ✓', isFinal: true, content: "Complete Training Guide ✓\n\nEach section now includes:\n• Estimated completion time\n• Step-by-step instructions with screenshot refs\n• Real-world marketing campaign examples\n• End-of-section checklists\n• Troubleshooting tips\n\nNext Steps:\n→ Module 2: Advanced Features (45 min)\n→ Reporting & Analytics Workshop\n→ Admin Settings — for team leads" },
  },
];

function ChatShell({ title, turns }: { title: string; turns: ChatTurn[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }).catch(() => {});
    }
  };

  return (
    <div
      className="rounded-lg overflow-hidden border border-[#e0e0e0] flex flex-col"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
    >
      <div
        className="flex items-center gap-3 px-4 py-2.5 border-b border-[#e0e0e0] flex-shrink-0"
        style={{ backgroundColor: '#f4f4f4' }}
      >
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-xs font-medium" style={{ color: '#525252' }}>{title}</span>
        </div>
        <div style={{ width: 54 }} />
      </div>

      <div
        className="flex flex-col gap-4 overflow-y-auto px-4 py-4"
        style={{ maxHeight: '380px', backgroundColor: '#ffffff' }}
      >
        {turns.map((turn, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex justify-end">
              <div className="flex flex-col items-end gap-1" style={{ maxWidth: '85%' }}>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-wide font-medium" style={{ color: '#0043ce' }}>
                    {turn.user.label}
                  </span>
                  <button
                    onClick={() => handleCopy(turn.user.text, i)}
                    className="p-1 rounded transition-colors hover:bg-[#edf5ff]"
                    title="Copy prompt"
                  >
                    {copiedIndex === i
                      ? <Check className="size-3" style={{ color: '#198038' }} />
                      : <Copy className="size-3 text-muted-foreground" />
                    }
                  </button>
                </div>
                <div
                  className="rounded-2xl rounded-tr-sm px-3 py-2 text-xs leading-relaxed"
                  style={{ backgroundColor: '#0f62fe', color: 'white' }}
                >
                  "{turn.user.text}"
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="flex flex-col items-start gap-1" style={{ maxWidth: '85%' }}>
                <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
                  {turn.ai.label}
                </span>
                <div
                  className="rounded-2xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed whitespace-pre-line"
                  style={
                    turn.ai.isFinal
                      ? { backgroundColor: '#d9fbfb', border: '1px solid #9ef0f0', color: 'var(--foreground)' }
                      : { backgroundColor: '#f4f4f4', color: 'var(--foreground)' }
                  }
                >
                  {turn.ai.content}
                </div>
                <span className="text-xs text-muted-foreground italic px-1">{turn.ai.note}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function S7Content() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChatShell title="Example 1: Creating a Job Description" turns={chatTurns1} />
      <ChatShell title="Example 2: Developing Training Material" turns={chatTurns2} />
    </div>
  );
}

// ─── S8Content — Prompt engineering ──────────────────────────────────────────

const WHEN_TO_USE = [
  { title: 'Unclear needs',   use: "When you're not sure exactly what you want" },
  { title: 'Complex topics',  use: 'When you need help simplifying the scope needs to break it down further' },
  { title: 'New domains',     use: "When you're learning something unfamiliar" },
  { title: 'Brainstorm options', use: 'When you want to explore options before committing' },
];

function S8Content() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium text-foreground mb-2">Stage 1 — the meta-prompt</div>
          <div className="border-l-[3px] border-[#a56eff] bg-[#f6f2ff] rounded-r-lg p-3 mb-3">
            <div className="text-xs font-medium text-[#6929c4] mb-1">What to say</div>
            <div className="text-sm text-foreground leading-relaxed">
              "I'm going to give you a prompt. Ask me clarifying questions, then suggest a more effective version that will yield more detailed, accurate output."
            </div>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            The AI will ask about your goals, audience, format preferences, technical requirements, and constraints.
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-foreground mb-2">Stage 2 — use the optimized prompt</div>
          <div className="border-l-[3px] border-[#ee5396] bg-[#fff0f7] rounded-r-lg p-3 mb-3">
            <div className="text-xs font-medium text-[#9f1853] mb-1">What you get</div>
            <div className="text-sm text-foreground leading-relaxed">
              A precise, detailed prompt tailored to your actual needs — often better than what you'd write yourself.
            </div>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            The AI identifies gaps you hadn't considered. It teaches you what good prompts look like as you go.
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          When to use this technique
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {WHEN_TO_USE.map((item, i) => (
            <Card key={i} className="p-3 gap-0" style={{ backgroundColor: '#fff0f7', border: '1px solid #9f1853' }}>
              <div className="text-sm font-medium mb-1" style={{ color: '#9f1853' }}>{item.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#9f1853' }}>{item.use}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── S9Content — What the AI asks ────────────────────────────────────────────

const AI_QUESTIONS = [
  { num: '1', title: 'Component type', desc: 'functional with hooks, or class component?', bg: '#f6f2ff', color: '#6929c4' },
  { num: '2', title: 'Behavior', desc: 'allow multiple sections open, or only one at a time? Animations?', bg: '#d9fbfb', color: '#007d79' },
  { num: '3', title: 'Accessibility', desc: 'ARIA labels, keyboard navigation needed?', bg: '#e5f6ff', color: '#0072c3' },
  { num: '4', title: 'Data structure', desc: 'array of objects? Will content include HTML or just text?', bg: '#edf5ff', color: '#0043ce' },
  { num: '5', title: 'Styling', desc: 'plain CSS, CSS Modules, Tailwind? Include basic styles or structure only?', bg: '#fff0f7', color: '#9f1853' },
  { num: '6', title: 'TypeScript', desc: 'should the output include full type definitions?', bg: '#defbe6', color: '#198038' },
];

function S9Content() {
  return (
    <div className="space-y-2">
      {AI_QUESTIONS.map((item) => (
        <Card key={item.num} className="flex-row gap-3 items-start p-3">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 mt-0.5"
            style={{ backgroundColor: item.bg, color: item.color }}
          >
            {item.num}
          </div>
          <div className="text-sm text-foreground leading-relaxed">
            <strong>{item.title}</strong> — {item.desc}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── S10Content — Key takeaways ───────────────────────────────────────────────

const TAKEAWAYS = [
  { num: '1', title: 'Be specific.',          desc: 'Include content type, tone, audience, word count, and purpose in every prompt.', bg: '#f6f2ff', color: '#6929c4' },
  { num: '2', title: 'Specify the format.',   desc: 'Tell the AI whether you want bullets, a table, step-by-step, or code.', bg: '#d9fbfb', color: '#007d79' },
  { num: '3', title: 'Break it down.',        desc: 'One requirement at a time — review before moving to the next step.', bg: '#e5f6ff', color: '#0072c3' },
  { num: '4', title: 'Iterate.',              desc: 'The first output is a draft. Refine tone, length, and structure through follow-up messages.', bg: '#edf5ff', color: '#0043ce' },
  { num: '5', title: 'Use the meta-prompt.',  desc: 'Ask AI to interview you and craft a better prompt before diving into the actual task.', bg: '#fff0f7', color: '#9f1853' },
];

function S10Content() {
  return (
    <div className="space-y-2">
      {TAKEAWAYS.map((item) => (
        <Card key={item.num} className="flex-row gap-3 items-start p-3">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 mt-0.5"
            style={{ backgroundColor: item.bg, color: item.color }}
          >
            {item.num}
          </div>
          <div className="text-sm text-foreground leading-relaxed">
            <strong>{item.title}</strong> {item.desc}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Slides data ──────────────────────────────────────────────────────────────

export const slides: Slide[] = [
  {
    id: 's0',
    badge: { text: 'Overview', color: '#6929c4', bgColor: '#f6f2ff' },
    title: 'Effective prompting',
    subtitle: 'A practical guide to getting better results from AI — five topics, one slide deck.',
    Content: OverviewContent,
  },
  {
    id: 's1',
    badge: { text: 'Topic 1', color: '#6929c4', bgColor: '#f6f2ff' },
    title: 'The four pillars of effective prompting',
    subtitle: "Think of it like giving directions — you wouldn't just say \"go to the store.\" You'd specify which store, give the address, explain why, and adjust if needed.",
    Content: S1Content,
  },
  {
    id: 's3',
    badge: { text: 'Topic 2', color: '#007d79', bgColor: '#d9fbfb' },
    title: 'Controlling length and format',
    subtitle: 'Specifying format ensures output is immediately usable — paste-ready tables, scannable bullets, or executable code.',
    Content: S3Content,
  },
  {
    id: 's4',
    badge: { text: 'Topic 3', color: '#0072c3', bgColor: '#e5f6ff' },
    title: 'Break tasks into smaller steps',
    subtitle: 'Large, complex requests often produce generic or error-prone output. Smaller steps give you control, clarity, and quality at each stage.',
    Content: S4Content,
  },
  {
    id: 's6',
    badge: { text: 'Topic 4', color: '#0043ce', bgColor: '#edf5ff' },
    title: 'Iterate — treat it as a conversation',
    subtitle: "Don't expect perfection on the first try. The prompt → evaluate → revise loop mirrors how humans naturally communicate.",
    Content: S6Content,
  },
  {
    id: 's7',
    badge: { text: 'Topic 4 — example', color: '#0043ce', bgColor: '#edf5ff' },
    title: 'Iteration in action',
    subtitle: 'Watch how three rounds of feedback transform a generic draft into a compelling, accurate job post.',
    Content: S7Content,
  },
  {
    id: 's8',
    badge: { text: 'Topic 5', color: '#9f1853', bgColor: '#fff0f7' },
    title: 'Prompt engineering inception',
    subtitle: "Use AI to help you build better prompts. Instead of crafting the perfect prompt yourself, let the AI interview you first — then generate an optimized prompt from your answers.",
    Content: S8Content,
  },
  {
    id: 's9',
    badge: { text: 'Topic 5 — example', color: '#9f1853', bgColor: '#fff0f7' },
    title: 'What the AI asks you',
    subtitle: 'Starting prompt: "Give me example code for a React accordion menu." — here\'s what the AI would clarify before writing a single line.',
    Content: S9Content,
  },
  {
    id: 's10',
    badge: { text: 'Summary', color: '#565151', bgColor: '#f7f3f2' },
    title: 'Key takeaways',
    subtitle: 'Five habits that will immediately improve every prompt you write.',
    Content: S10Content,
  },
];