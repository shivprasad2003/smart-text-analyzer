import React from "react";

const NER_LABEL_COLORS = {
  PERSON: "ner-PERSON",
  ORG: "ner-ORG",
  GPE: "ner-GPE",
  LOC: "ner-LOC",
  DATE: "ner-DATE",
  TIME: "ner-TIME",
  MONEY: "ner-MONEY",
  PERCENT: "ner-PERCENT",
  PRODUCT: "ner-PRODUCT",
  EVENT: "ner-EVENT",
  FAC: "ner-FAC",
  NORP: "ner-NORP",
};

function getClass(label) {
  return NER_LABEL_COLORS[label] || "ner-DEFAULT";
}

function HighlightedText({ text, entities }) {
  if (!entities || entities.length === 0) {
    return <span>{text}</span>;
  }

  const sorted = [...entities].sort((a, b) => a.start - b.start);
  const parts = [];
  let cursor = 0;

  sorted.forEach((ent, idx) => {
    if (ent.start > cursor) {
      parts.push(
        <span key={`plain-${idx}`}>{text.slice(cursor, ent.start)}</span>
      );
    }
    parts.push(
      <mark
        key={`ent-${idx}`}
        className={`ner-highlight ${getClass(ent.label)}`}
        title={`${ent.label}: ${ent.description}`}
      >
        {text.slice(ent.start, ent.end)}
        <sup className="ner-label">{ent.label}</sup>
      </mark>
    );
    cursor = ent.end;
  });

  if (cursor < text.length) {
    parts.push(<span key="tail">{text.slice(cursor)}</span>);
  }

  return <>{parts}</>;
}

function NerSection({ entities, text, metrics }) {
  return (
    <div>
      {/* Accuracy Metrics */}
      <div className="metrics-box">
        <div className="metric-item">
          <span className="metric-label">Entities Found</span>
          <span className="metric-value">{entities.length}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Entity Coverage</span>
          <span className="metric-value">
            {(metrics.entity_coverage * 100).toFixed(1)}%
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Unique Labels</span>
          <span className="metric-value">{metrics.unique_labels.join(", ") || "—"}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Model</span>
          <span className="metric-value">{metrics.model}</span>
        </div>
      </div>

      {/* Highlighted Text */}
      <div className="subsection">
        <p className="subsection-title">Annotated Text</p>
        <div className="ner-text-container">
          <HighlightedText text={text} entities={entities} />
        </div>
      </div>

      {/* Entity Table */}
      {entities.length > 0 ? (
        <div className="subsection">
          <p className="subsection-title">Entity Details</p>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Entity</th>
                <th>Label</th>
                <th>Description</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((ent, i) => (
                <tr key={i}>
                  <td style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{ent.text}</td>
                  <td>
                    <span className={`entity-label-badge ${getClass(ent.label)}`}>
                      {ent.label}
                    </span>
                  </td>
                  <td style={{ color: "#6b7280", fontSize: "0.8125rem" }}>
                    {ent.description}
                  </td>
                  <td style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#9ca3af" }}>
                    {ent.start}–{ent.end}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No named entities detected in this text.</p>
        </div>
      )}
    </div>
  );
}

export default NerSection;
