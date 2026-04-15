import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import TokensSection from "./components/TokensSection";
import PosTagsSection from "./components/PosTagsSection";
import LemmasSection from "./components/LemmasSection";
import TfidfSection from "./components/TfidfSection";
import NerSection from "./components/NerSection";
import WordnetSection from "./components/WordnetSection";

const API_BASE = "https://smart-text-analyzer-x9jm.onrender.com";

const SAMPLE_TEXT =
  "Apple Inc. was founded by Steve Jobs and Steve Wozniak in Cupertino, California in 1976. " +
  "The company revolutionized personal computing and later introduced the iPhone in 2007. " +
  "Today, Apple is one of the most valuable companies in the world with a market cap exceeding two trillion dollars.";

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("tokens");

  const handleAnalyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please enter some text before analyzing.");
      return;
    }
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const [analyzeRes, tfidfRes, nerRes, wordnetRes] = await Promise.all([
        axios.post(`${API_BASE}/analyze`, { text: trimmed }),
        axios.post(`${API_BASE}/tfidf`, { text: trimmed }),
        axios.post(`${API_BASE}/ner`, { text: trimmed }),
        axios.post(`${API_BASE}/wordnet`, { text: trimmed }),
      ]);
      setResults({
        analyze: analyzeRes.data,
        tfidf: tfidfRes.data,
        ner: nerRes.data,
        wordnet: wordnetRes.data,
      });
      setActiveTab("tokens");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to the backend. Make sure the FastAPI server is running on http://localhost:8000"
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResults(null);
    setError("");
  };

  const handleSample = () => {
    setText(SAMPLE_TEXT);
    setError("");
  };

  const tabs = [
    { id: "tokens", label: "Tokens" },
    { id: "pos", label: "POS Tags" },
    { id: "lemmas", label: "Lemmas" },
    { id: "tfidf", label: "TF-IDF" },
    { id: "ner", label: "NER" },
    { id: "wordnet", label: "WordNet" },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <svg viewBox="0 0 32 32" width="36" height="36" aria-label="NLP logo" fill="none">
              <circle cx="16" cy="16" r="15" stroke="#4f8ef7" strokeWidth="2" />
              <circle cx="16" cy="16" r="5" fill="#4f8ef7" />
              <line x1="16" y1="1" x2="16" y2="11" stroke="#4f8ef7" strokeWidth="2" />
              <line x1="16" y1="21" x2="16" y2="31" stroke="#4f8ef7" strokeWidth="2" />
              <line x1="1" y1="16" x2="11" y2="16" stroke="#4f8ef7" strokeWidth="2" />
              <line x1="21" y1="16" x2="31" y2="16" stroke="#4f8ef7" strokeWidth="2" />
            </svg>
            <div>
              <h1>Smart Text Analyzer</h1>
              <span className="header-subtitle">NLP & Named Entity Recognition</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="app-main">
        {/* Input Card */}
        <section className="card input-card">
          <h2 className="section-title">Input Text</h2>
          <textarea
            className="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here…"
            rows={7}
            aria-label="Text to analyze"
          />
          <div className="input-actions">
            <div className="input-actions-left">
              <button className="btn btn-secondary" onClick={handleSample} disabled={loading}>
                Load Sample
              </button>
              <button className="btn btn-ghost" onClick={handleClear} disabled={loading}>
                Clear
              </button>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Analyzing…
                </>
              ) : (
                "Analyze Text"
              )}
            </button>
          </div>
          {error && (
            <div className="error-banner" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {/* Results */}
        {results && (
          <section className="card results-card">
            {/* Stats bar */}
            <div className="stats-bar">
              <div className="stat">
                <span className="stat-num">{results.analyze.token_count}</span>
                <span className="stat-label">Tokens</span>
              </div>
              <div className="stat">
                <span className="stat-num">{results.analyze.filtered_count}</span>
                <span className="stat-label">Filtered Tokens</span>
              </div>
              <div className="stat">
                <span className="stat-num">{results.ner.entity_count}</span>
                <span className="stat-label">Named Entities</span>
              </div>
              <div className="stat">
                <span className="stat-num">{results.tfidf.sentence_count}</span>
                <span className="stat-label">Sentences</span>
              </div>
              <div className="stat">
                <span className="stat-num">{results.wordnet.word_count}</span>
                <span className="stat-label">WordNet Words</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="tab-panel">
              {activeTab === "tokens" && (
                <TokensSection
                  tokens={results.analyze.tokens}
                  filteredTokens={results.analyze.filtered_tokens}
                />
              )}
              {activeTab === "pos" && (
                <PosTagsSection posTags={results.analyze.pos_tags} />
              )}
              {activeTab === "lemmas" && (
                <LemmasSection lemmas={results.analyze.lemmas} />
              )}
              {activeTab === "tfidf" && (
                <TfidfSection tfidf={results.tfidf.tfidf} />
              )}
              {activeTab === "ner" && (
                <NerSection
                  entities={results.ner.entities}
                  text={results.ner.text}
                  metrics={results.ner.metrics}
                />
              )}
              {activeTab === "wordnet" && (
                <WordnetSection wordnet={results.wordnet.wordnet} />
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Smart Text Analyzer · FastAPI + React · NLTK · spaCy · scikit-learn</p>
      </footer>
    </div>
  );
}

export default App;
