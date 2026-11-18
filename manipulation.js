/**
 * DAY 22 - DOM MANIPULATION MASTER CLASS
 * Pure JavaScript Reference & Simulation Guide
 * 
 * Topics Covered:
 * 1. Node Creation, Cloning & DocumentFragments
 * 2. insertAdjacentHTML & insertAdjacentElement
 * 3. Modern Insertion (append, prepend, before, after, replaceWith)
 * 4. Attributes vs Properties & Dataset APIs
 * 5. Style Manipulation & Dynamic CSS Variables
 * 6. Layout Thrashing (Read/Write batching & requestAnimationFrame)
 * 7. HTML <template> Tag usage
 */

// ==========================================
// 1. SIMULATED DOM ENGINE FOR CONSOLE RUNS
// ==========================================
class MockElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = new Map();
    this.dataset = {};
    this.style = {};
    this.classList = new Set();
    this.textContent = '';
    this.parentNode = null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
    if (name.startsWith('data-')) {
      const camel = name.slice(5).replace(/-([a-z])/g, (_, g) => g.toUpperCase());
      this.dataset[camel] = String(value);
    }
  }

  getAttribute(name) {
    return this.attributes.get(name) || null;
  }

  append(...nodes) {
    for (const node of nodes) {
      if (typeof node === 'string') {
        const textNode = { nodeType: 3, textContent: node, parentNode: this };
        this.children.push(textNode);
      } else {
        node.parentNode = this;
        this.children.push(node);
      }
    }
  }

  cloneNode(deep = false) {
    const clone = new MockElement(this.tagName);
    this.attributes.forEach((val, key) => clone.setAttribute(key, val));
    clone.textContent = this.textContent;
    clone.style = { ...this.style };
    clone.classList = new Set(this.classList);
    if (deep) {
      clone.children = this.children.map(c => (c.cloneNode ? c.cloneNode(true) : { ...c, parentNode: clone }));
    }
    return clone;
  }

  toString(indent = 0) {
    const pad = '  '.repeat(indent);
    const attrs = Array.from(this.attributes.entries())
      .map(([k, v]) => ` ${k}="${v}"`)
      .join('');
    const classes = this.classList.size ? ` class="${Array.from(this.classList).join(' ')}"` : '';
    const styles = Object.keys(this.style).length ? ` style="${Object.entries(this.style).map(([k,v]) => `${k}:${v}`).join(';')}"` : '';

    if (!this.children.length && !this.textContent) {
      return `${pad}<${this.tagName.toLowerCase()}${attrs}${classes}${styles} />`;
    }
    const inner = this.textContent
      ? `${pad}  ${this.textContent}\n`
      : this.children.map(c => (c.toString ? c.toString(indent + 1) : `${pad}  ${c.textContent}`)).join('\n') + '\n';
    return `${pad}<${this.tagName.toLowerCase()}${attrs}${classes}${styles}>\n${inner}${pad}</${this.tagName.toLowerCase()}>`;
  }
}

// ==========================================
// 2. RUNNABLE EXAMPLES
// ==========================================

console.log("==========================================");
console.log("DAY 22: JAVASCRIPT DOM MANIPULATION MASTER");
console.log("==========================================\n");

// --- A. CREATING AND APENDING NODES ---
console.log("--- 1. Node Creation & DocumentFragment ---");
const container = new MockElement('div');
container.setAttribute('id', 'app-root');

// High performance batching with DocumentFragment simulation
const items = ['Dashboard', 'Analytics', 'Settings', 'Profile'];
items.forEach((item, idx) => {
  const card = new MockElement('article');
  card.classList.add('nav-card');
  card.setAttribute('data-id', `nav-${idx + 1}`);
  card.textContent = item;
  card.style['padding'] = '8px 16px';
  container.append(card);
});

console.log("Generated Container HTML Tree:");
console.log(container.toString());

// --- B. ATTRIBUTES VS PROPERTIES ---
console.log("\n--- 2. Attributes vs Properties ---");
const inputMock = new MockElement('input');
inputMock.setAttribute('type', 'text');
inputMock.setAttribute('value', 'Initial Default');

console.log(`getAttribute('value'): "${inputMock.getAttribute('value')}"`);
// Property update (in DOM, input.value does not change HTML attribute default)
inputMock.textContent = 'User typed this...';
console.log(`Simulated Property Value: "${inputMock.textContent}"`);
console.log(`Attribute remains unchanged: "${inputMock.getAttribute('value')}"`);

// --- C. CLONING NODES ---
console.log("\n--- 3. Deep Node Cloning ---");
const originalCard = container.children[0];
const shallowClone = originalCard.cloneNode(false);
const deepClone = originalCard.cloneNode(true);

console.log("Original Tag:", originalCard.tagName);
console.log("Shallow Clone text:", shallowClone.textContent || "(empty)");
console.log("Deep Clone text:", deepClone.textContent);

// --- D. LAYOUT THRASHING PREVENTION PATTERN ---
console.log("\n--- 4. Layout Thrashing Pattern (FastDOM / Batching) ---");
console.log(`
BAD PATTERN (Layout Thrash):
  for (let i = 0; i < cards.length; i++) {
    const width = cards[i].offsetWidth; // READ (forces recalculation)
    cards[i].style.width = width * 2 + 'px'; // WRITE (invalidates layout)
  }

GOOD PATTERN (Batching):
  // Step 1: Batch all READS
  const widths = cards.map(c => c.getBoundingClientRect().width);
  // Step 2: Batch all WRITES (e.g. inside requestAnimationFrame)
  requestAnimationFrame(() => {
    cards.forEach((c, i) => {
      c.style.width = \`\${widths[i] * 2}px\`;
    });
  });
`);

console.log("✅ DOM Manipulation script executed cleanly without errors.");
