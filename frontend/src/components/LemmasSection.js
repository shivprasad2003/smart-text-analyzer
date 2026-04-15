import React from "react";

function LemmasSection({ lemmas }) {
  const changed = lemmas.filter((l) => l.word.toLowerCase() !== l.lemma);
  return (
    <div>
      <div className="subsection">
        <p className="subsection-title">
          Lemmatized Words — {changed.length} words changed
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Original Word</th>
              <th>Lemma</th>
              <th>POS</th>
              <th>Changed?</th>
            </tr>
          </thead>
          <tbody>
            {lemmas.map((item, i) => {
              const isChanged = item.word.toLowerCase() !== item.lemma;
              return (
                <tr key={i}>
                  <td style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{i + 1}</td>
                  <td style={{ fontWeight: isChanged ? 600 : 400 }}>{item.word}</td>
                  <td style={{ color: isChanged ? "#3b6ff0" : "#6b7280", fontWeight: isChanged ? 600 : 400 }}>
                    {item.lemma}
                  </td>
                  <td>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#9ca3af" }}>
                      {item.pos}
                    </span>
                  </td>
                  <td>
                    {isChanged ? (
                      <span style={{ color: "#16a34a", fontSize: "0.75rem", fontWeight: 600 }}>✓ Yes</span>
                    ) : (
                      <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LemmasSection;
