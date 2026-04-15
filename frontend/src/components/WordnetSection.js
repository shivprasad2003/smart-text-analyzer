import React from "react";

function WordnetSection({ wordnet }) {
  const entries = Object.entries(wordnet);

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <p>No WordNet data found. The text may contain only stop words or unknown terms.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="subsection-title">{entries.length} words with WordNet data</p>
      <div className="wordnet-grid">
        {entries.map(([word, data]) => (
          <div key={word} className="wordnet-card">
            <div className="wordnet-word">
              {word}
              <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 400, marginLeft: 6, fontFamily: "monospace" }}>
                {data.pos}
              </span>
            </div>
            <p className="wordnet-def">{data.definition}</p>

            {data.synonyms.length > 0 && (
              <>
                <p className="wordnet-section-label">Synonyms</p>
                <div className="wordnet-pills">
                  {data.synonyms.map((s) => (
                    <span key={s} className="syn-pill">{s}</span>
                  ))}
                </div>
              </>
            )}

            {data.antonyms.length > 0 && (
              <>
                <p className="wordnet-section-label">Antonyms</p>
                <div className="wordnet-pills">
                  {data.antonyms.map((a) => (
                    <span key={a} className="ant-pill">{a}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WordnetSection;
