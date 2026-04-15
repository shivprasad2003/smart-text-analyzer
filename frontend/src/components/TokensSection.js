import React from "react";

const isPunct = (t) => !/[a-zA-Z0-9]/.test(t);

function TokensSection({ tokens, filteredTokens }) {
  return (
    <div>
      <div className="subsection">
        <p className="subsection-title">All Tokens ({tokens.length})</p>
        <div className="token-cloud">
          {tokens.map((t, i) => (
            <span key={i} className={`token-pill${isPunct(t) ? " punct" : ""}`}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="subsection">
        <p className="subsection-title">
          Filtered Tokens — stopwords &amp; punctuation removed ({filteredTokens.length})
        </p>
        <div className="token-cloud">
          {filteredTokens.length > 0 ? (
            filteredTokens.map((t, i) => (
              <span key={i} className="token-pill filtered">
                {t}
              </span>
            ))
          ) : (
            <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
              No tokens remain after filtering.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TokensSection;
