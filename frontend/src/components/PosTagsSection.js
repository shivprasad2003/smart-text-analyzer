import React from "react";

const POS_COLORS = {
  NN: { bg: "#dbeafe", color: "#1e3a8a" },
  NNS: { bg: "#dbeafe", color: "#1e3a8a" },
  NNP: { bg: "#ede9fe", color: "#4c1d95" },
  NNPS: { bg: "#ede9fe", color: "#4c1d95" },
  VB: { bg: "#d1fae5", color: "#065f46" },
  VBD: { bg: "#d1fae5", color: "#065f46" },
  VBG: { bg: "#d1fae5", color: "#065f46" },
  VBN: { bg: "#d1fae5", color: "#065f46" },
  VBP: { bg: "#d1fae5", color: "#065f46" },
  VBZ: { bg: "#d1fae5", color: "#065f46" },
  JJ: { bg: "#fef3c7", color: "#92400e" },
  JJR: { bg: "#fef3c7", color: "#92400e" },
  JJS: { bg: "#fef3c7", color: "#92400e" },
  RB: { bg: "#ffedd5", color: "#9a3412" },
  RBR: { bg: "#ffedd5", color: "#9a3412" },
  RBS: { bg: "#ffedd5", color: "#9a3412" },
  DT: { bg: "#f3f4f6", color: "#374151" },
  IN: { bg: "#f3f4f6", color: "#374151" },
  CC: { bg: "#f3f4f6", color: "#374151" },
  PRP: { bg: "#fce7f3", color: "#831843" },
  CD: { bg: "#dcfce7", color: "#14532d" },
};

const POS_DESCRIPTIONS = {
  NN: "Noun, singular", NNS: "Noun, plural", NNP: "Proper noun, singular",
  NNPS: "Proper noun, plural", VB: "Verb, base", VBD: "Verb, past tense",
  VBG: "Verb, gerund", VBN: "Verb, past participle", VBP: "Verb, non-3rd person",
  VBZ: "Verb, 3rd person singular", JJ: "Adjective", JJR: "Adjective, comparative",
  JJS: "Adjective, superlative", RB: "Adverb", RBR: "Adverb, comparative",
  RBS: "Adverb, superlative", DT: "Determiner", IN: "Preposition/conjunction",
  CC: "Coordinating conjunction", PRP: "Personal pronoun", CD: "Cardinal number",
  "PRP$": "Possessive pronoun", WP: "Wh-pronoun", WDT: "Wh-determiner",
  WRB: "Wh-adverb", TO: "to", MD: "Modal", EX: "Existential there",
  ".": "Punctuation", ",": "Comma", ":": "Colon", "\"": "Quote",
  "(": "Left bracket", ")": "Right bracket",
};

function getBadgeStyle(pos) {
  return POS_COLORS[pos] || { bg: "#f3f4f6", color: "#374151" };
}

function PosTagsSection({ posTags }) {
  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Word</th>
            <th>POS Tag</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {posTags.map((item, i) => {
            const style = getBadgeStyle(item.pos);
            return (
              <tr key={i}>
                <td style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{item.word}</td>
                <td>
                  <span
                    className="pos-badge"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {item.pos}
                  </span>
                </td>
                <td style={{ color: "#6b7280", fontSize: "0.8125rem" }}>
                  {POS_DESCRIPTIONS[item.pos] || item.pos}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PosTagsSection;
