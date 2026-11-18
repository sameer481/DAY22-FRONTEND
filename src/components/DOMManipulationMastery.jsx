import React, { useState, useRef, useEffect } from 'react';
import styles from './DOMManipulationMastery.module.css';

export default function DOMManipulationMastery() {
  const [activeTab, setActiveTab] = useState('crud');

  // CRUD Tab State
  const [nodes, setNodes] = useState([
    { id: 1, text: 'Initial Node Item Alpha', tag: 'div', role: 'primary' },
    { id: 2, text: 'Initial Node Item Beta', tag: 'section', role: 'secondary' }
  ]);
  const [newText, setNewText] = useState('');
  const [insertionPoint, setInsertionPoint] = useState('beforeend');

  // Attribute & Dataset State
  const [attrData, setAttrData] = useState({
    title: 'Interactive Widget',
    role: 'alert',
    'data-user-id': 'usr_9421',
    'data-category': 'system-metric'
  });

  // CSS Variables State
  const [cssRadius, setCssRadius] = useState(12);
  const [cssHue, setCssHue] = useState(210);
  const [cssPadding, setCssPadding] = useState(16);

  // Geometry Inspector Ref & State
  const geometryBoxRef = useRef(null);
  const [boxRect, setBoxRect] = useState({ width: 0, height: 0, top: 0, left: 0 });

  useEffect(() => {
    if (geometryBoxRef.current) {
      const rect = geometryBoxRef.current.getBoundingClientRect();
      setBoxRect({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left)
      });
    }
  }, [cssPadding, cssRadius, activeTab]);

  // Node operations
  const handleAddNode = () => {
    if (!newText.trim()) return;
    const newNode = {
      id: Date.now(),
      text: newText,
      tag: 'article',
      role: 'custom-node'
    };

    if (insertionPoint === 'afterbegin') {
      setNodes([newNode, ...nodes]);
    } else {
      setNodes([...nodes, newNode]);
    }
    setNewText('');
  };

  const handleRemoveNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const handleCloneNode = (node) => {
    const clone = {
      ...node,
      id: Date.now(),
      text: `${node.text} (Clone)`
    };
    setNodes([...nodes, clone]);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Day 22: DOM Manipulation Mastery</h1>
        <p className={styles.subtitle}>
          Interactive Laboratory for Node Lifecycle, Mutation APIs, Dataset Attributes & Geometry Calculation
        </p>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'crud' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('crud')}
        >
          Node CRUD & Positions
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'attributes' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('attributes')}
        >
          Attributes & Dataset
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'css' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('css')}
        >
          CSS Variables & Geometry
        </button>
      </nav>

      {/* TAB 1: Node CRUD & Positions */}
      {activeTab === 'crud' && (
        <section className={styles.panel}>
          <div className={styles.controlRow}>
            <input
              type="text"
              placeholder="Enter node text content..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className={styles.input}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
            />
            <select
              value={insertionPoint}
              onChange={(e) => setInsertionPoint(e.target.value)}
              className={styles.input}
              style={{ flex: 'none', width: '180px' }}
            >
              <option value="beforeend">append (beforeend)</option>
              <option value="afterbegin">prepend (afterbegin)</option>
            </select>
            <button onClick={handleAddNode} className={`${styles.button} ${styles.accentBtn}`}>
              + Insert Node
            </button>
            <button onClick={() => setNodes([])} className={`${styles.button} ${styles.dangerBtn}`}>
              Clear All
            </button>
          </div>

          <div className={styles.sandboxBox}>
            {nodes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 'auto' }}>
                No active nodes. Use the input above to insert DOM elements.
              </p>
            ) : (
              nodes.map((node) => (
                <div key={node.id} className={styles.domCard}>
                  <div>
                    <strong>{node.text}</strong>
                    <div className={styles.cardMeta}>
                      &lt;{node.tag} data-role="{node.role}" id="{node.id}"&gt;
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleCloneNode(node)}
                      className={styles.button}
                      style={{ padding: '4px 10px', fontSize: '0.8rem', background: '#475569' }}
                    >
                      cloneNode(true)
                    </button>
                    <button
                      onClick={() => handleRemoveNode(node.id)}
                      className={`${styles.button} ${styles.dangerBtn}`}
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    >
                      remove()
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* TAB 2: Attributes & Dataset */}
      {activeTab === 'attributes' && (
        <section className={styles.panel}>
          <h3>Dataset & Attribute Reflection Engine</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            HTML `data-*` attributes are automatically converted to camelCase properties on <code>element.dataset</code>.
          </p>

          <div className={styles.controlRow}>
            <input
              type="text"
              value={attrData.title}
              onChange={(e) => setAttrData({ ...attrData, title: e.target.value })}
              className={styles.input}
              placeholder="title attribute"
            />
            <input
              type="text"
              value={attrData['data-user-id']}
              onChange={(e) => setAttrData({ ...attrData, 'data-user-id': e.target.value })}
              className={styles.input}
              placeholder="data-user-id"
            />
          </div>

          <div className={styles.inspectorGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>HTML Attribute String</div>
              <div className={styles.metricValue}>
                title="{attrData.title}"<br />
                data-user-id="{attrData['data-user-id']}"
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>JavaScript dataset.userId</div>
              <div className={styles.metricValue}>
                "{attrData['data-user-id']}"
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <pre className={styles.codePreview}>
{`// JavaScript DOM Inspection
const el = document.querySelector('#target');

// Reading standard attributes
console.log(el.getAttribute('title')); // "${attrData.title}"

// Reading dataset property (hyphen-case becomes camelCase)
console.log(el.dataset.userId);       // "${attrData['data-user-id']}"`}
            </pre>
          </div>
        </section>
      )}

      {/* TAB 3: CSS Variables & Geometry */}
      {activeTab === 'css' && (
        <section className={styles.panel}>
          <h3>Dynamic CSS Variable Injection & Layout Metrics</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manipulate CSS Custom Properties dynamically via <code>element.style.setProperty('--varName', val)</code>.
          </p>

          <div className={styles.sliderGroup}>
            <label>Border Radius: {cssRadius}px</label>
            <input
              type="range"
              min="0"
              max="40"
              value={cssRadius}
              onChange={(e) => setCssRadius(Number(e.target.value))}
            />
          </div>

          <div className={styles.sliderGroup}>
            <label>Color Hue: {cssHue}deg</label>
            <input
              type="range"
              min="0"
              max="360"
              value={cssHue}
              onChange={(e) => setCssHue(Number(e.target.value))}
            />
          </div>

          <div className={styles.sliderGroup}>
            <label>Internal Padding: {cssPadding}px</label>
            <input
              type="range"
              min="8"
              max="48"
              value={cssPadding}
              onChange={(e) => setCssPadding(Number(e.target.value))}
            />
          </div>

          <div
            ref={geometryBoxRef}
            style={{
              borderRadius: `${cssRadius}px`,
              backgroundColor: `hsl(${cssHue}, 70%, 25%)`,
              border: `2px solid hsl(${cssHue}, 80%, 60%)`,
              padding: `${cssPadding}px`,
              marginTop: '16px',
              transition: 'all 0.15s ease-out',
              textAlign: 'center'
            }}
          >
            Dynamic Target Node (Live getBoundingClientRect Target)
          </div>

          <div className={styles.inspectorGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Computed Width</div>
              <div className={styles.metricValue}>{boxRect.width}px</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Computed Height</div>
              <div className={styles.metricValue}>{boxRect.height}px</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
