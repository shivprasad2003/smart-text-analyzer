import React from "react";

function TfidfSection({ tfidf }) {
  const maxScore = tfidf.length > 0 ? tfidf[0].score : 1;

  if (tfidf.length === 0) {
    return (
      <div className="empty-state">
        <p>No TF-IDF scores computed (text may be too short).</p>
      </div>
    );
  }

  return (
    <div>
      <p className="subsection-title">
        Top {tfidf.length} Terms by TF-IDF Score
      </p>
      <table className="data-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Term</th>
            <th style={{ minWidth: 200 }}>TF-IDF Score</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {tfidf.map((item, i) => (
            <tr key={i}>
              <td style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{i + 1}</td>
              <td style={{ fontWeight: 600 }}>{item.word}</td>
              <td>
                <div className="tfidf-bar-wrap">
                  <div className="tfidf-bar-bg">
                    <div
                      className="tfidf-bar-fill"
                      style={{ width: `${(item.score / maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              </td>
              <td>
                <span className="tfidf-score">{item.score.toFixed(4)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TfidfSection;
