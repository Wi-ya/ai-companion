# Practicum Project: The AI Laboratory
**An Interactive Exploration of the "Chinese Room" and AI Token Manipulation**

## 1. Core Thesis
This project explores how 'intelligent' AI models simulate personality and cognition. Referencing John Searle’s "Chinese Room" thought experiment, the app demonstrates that AI does not possess true emotional intelligence (Weak AI). Instead, it processes symbols (prompts) and manipulates the mathematical probabilities of the next generated token based on hidden rules. 

To prove this, the application functions as an "AI Laboratory." It breaks down complex AI behavior into isolated, interactive lessons where users can manipulate mathematical parameters one at a time to see how the illusion of intelligence is controlled.

## 2. Tech Stack 
* **Framework:** Next.js (App Router) + React
* **Language:** TypeScript
* **AI Integration:** Vercel AI SDK 
* **Styling & UI:** Tailwind CSS + shadcn/ui 
* **Primary Model:** Google Gemini 2.5 Flash (via Google AI Studio API)

## 3. App Architecture & UX Flow (Feature-Based Routing)
The app uses **Progressive Disclosure**, moving users from a simple chatbot experience through a series of isolated experiments. The learning modules utilize a **Tabs UI** to seamlessly switch between academic explanation and interactive testing on the exact same page.

**Current implementation:** The root `/` page implements the Main Chat: users choose a personality (Supportive, Witty, Calm, Curious, Direct) and chat with the AI companion. Personality system prompts and chat are powered by **Gemini 2.5 Flash** via the Vercel AI SDK and `app/api/chat`. The learn routes and labs below are planned next.

* **`/` (The Main Chat):** A clean interface where users select a "Personality" (e.g., Sarcastic, Logical). Contains a CTA button: *"Learn how AI behavior is controlled."* *(Personality picker + chat implemented.)*
* **`/learn/temperature`:** Tabs for Temperature Theory & A/B Playground.
* **`/learn/top-p`:** Tabs for Top-P/Top-K Theory & A/B Playground.
* **`/learn/penalties`:** Tabs for Frequency/Presence Penalty Theory & A/B Playground.
* **`/learn/memory`:** Tabs for Context Window Theory & Playground.
* **`/learn/models`:** Tabs for Model Size Theory & Matchup Playground.

## 4. The Parameter Labs
Each lab features two tabs: 
1. **Theory:** A brief, accessible explanation of the mathematical parameter.
2. **Playground:** A split-screen UI with fixed prompts (e.g., *"Write a fantasy tavern description"*) where users adjust a single parameter on the left and right sides to see isolated, side-by-side behavioral changes.

### Lab 1: Temperature (Creativity vs. Logic)
* **What it is:** Controls the randomness of token selection. 
* **Importance:** It is the primary driver of "personality." It proves the AI is just rolling loaded dice.
* **The Playground Experience:** Users tweak two Temperature sliders (0.0 to 2.0). Left side (Temp 0.1) outputs a rigid, highly probable, boring response. Right side (Temp 1.5) outputs a highly creative, chaotic, or eccentric response. 

### Lab 2: Top-P & Top-K (Vocabulary Restriction)
* **What they are:** * **Top-P (Nucleus Sampling):** Chops off the bottom percentage of the vocabulary list (e.g., Top-P 0.1 means the AI only considers the top 10% most likely words).
    * **Top-K:** Limits the AI to choosing from an exact number of next-word possibilities (e.g., Top-K 5).
* **Importance:** Shows how restricting vocabulary forces the AI into robotic loops, breaking the illusion of fluency.
* **The Playground Experience:** Using a complex prompt like *"Explain quantum physics,"* a low Top-P/Top-K forces the AI to use basic, repetitive words. A high value allows for nuanced, complex jargon.

### Lab 3: Frequency & Presence Penalties (Topic Forcing)
* **What they are:** * **Frequency Penalty:** Mathematically punishes the AI for repeating the exact same word.
    * **Presence Penalty:** Mathematically punishes the AI for staying on the same topic.
* **Importance:** Proves the AI doesn't "understand" conversational flow; it is just reacting to point-deductions.
* **The Playground Experience:** With high penalties, users will watch the AI awkwardly switch topics mid-sentence or use bizarre, obscure synonyms just to avoid a mathematical penalty.

### Lab 4: The Context Window (Memory Limits)
* **What it is:** The array of previous messages passed back to the AI. AI has no internal memory; it only reads the text array sent in the current request.
* **Importance:** Demonstrates that the AI's "memory" is a fragile illusion that depends entirely on the UI passing data back and forth.
* **The Playground Experience:** A slider dictates how many past messages the AI is allowed to "see." If the memory slider is dropped to `1`, the AI instantly forgets its assigned persona and the user's previous inputs.

### Lab 5: Parameter Size (David vs. Goliath)
* **What it is:** Comparing models with vastly different amounts of training data and parameters (e.g., Gemini 2.5 Flash vs. a smaller model).
* **Importance:** Proves that massive parameter counts are required to simulate deep nuance, while smaller models act more like direct text-calculators.
* **The Playground Experience:** A dropdown selects different models for the left and right columns using the exact same prompt to highlight the disparity in reasoning and formatting.

## 5. Execution Strategy for Demoing
To ensure a flawless presentation:
1.  **No Live Typing in Playgrounds:** The A/B labs rely entirely on hardcoded, fixed prompt buttons to guarantee perfect, contrasting outputs every time.
2.  **Simultaneous Generation:** React state manages two separate API calls simultaneously so the contrast between parameters is immediate, visual, and side-by-side.

## 6. When to Use Templates vs. Simple Params
* **A/B Playgrounds (e.g. temperature, top-p):** Do *not* use prompt templates. Each lab varies only one parameter (e.g. temp 0.1 vs 1.5). Use the same system prompt and messages; make two API calls with different single-parameter values. Simple and clear.
* **Main / Developer page (full parameter controls):** Use a **template** (or one flexible request shape) for the main chat when users can adjust many options (system prompt, temperature, top-p, top-k, penalties, model, etc.). A single template with placeholders—or one API that accepts all parameters—lets users mix and match without writing separate logic for every combination. Incorporate templates here so the “all parameters” experience stays maintainable.
* **No AI function/tool calling:** We are not defining functions for the model to call (e.g. “get_weather”, “send_email”). Messages and behavior are driven entirely by app logic in TypeScript: we choose the system prompt, build the request, and stream the reply. The AI only generates text; we do not need tools.