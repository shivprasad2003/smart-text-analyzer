import nltk
import spacy
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import wordnet, stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag

# ─── Auto-download NLTK data ─────────────────────────────────────────────────
for pkg in ["punkt", "punkt_tab", "averaged_perceptron_tagger",
            "averaged_perceptron_tagger_eng", "stopwords", "wordnet", "omw-1.4"]:
    try:
        nltk.download(pkg, quiet=True)
    except Exception:
        pass

# ─── Load spaCy model ────────────────────────────────────────────────────────
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise RuntimeError(
        "spaCy model not found. Run: python -m spacy download en_core_web_sm"
    )

app = FastAPI(title="Smart Text Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://smart-text-analyzer-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

lemmatizer = WordNetLemmatizer()
STOP_WORDS = set(stopwords.words("english"))

# ─── POS tag → WordNet POS mapping ───────────────────────────────────────────
def get_wordnet_pos(treebank_tag: str) -> str:
    if treebank_tag.startswith("J"):
        return wordnet.ADJ
    if treebank_tag.startswith("V"):
        return wordnet.VERB
    if treebank_tag.startswith("R"):
        return wordnet.ADV
    return wordnet.NOUN


# ─── Request schema ──────────────────────────────────────────────────────────
class TextInput(BaseModel):
    text: str


# ─── Routes ──────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Smart Text Analyzer API is running.", "version": "1.0.0"}


@app.post("/analyze")
def analyze(payload: TextInput):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    tokens = word_tokenize(text)
    pos_tags = pos_tag(tokens)

    filtered_tokens = [
        t for t in tokens if t.lower() not in STOP_WORDS and t.isalpha()
    ]

    lemmas = [
        {
            "word": word,
            "lemma": lemmatizer.lemmatize(word.lower(), get_wordnet_pos(tag)),
            "pos": tag,
        }
        for word, tag in pos_tags
        if word.isalpha()
    ]

    pos_result = [{"word": w, "pos": t} for w, t in pos_tags]

    return {
        "tokens": tokens,
        "filtered_tokens": filtered_tokens,
        "pos_tags": pos_result,
        "lemmas": lemmas,
        "token_count": len(tokens),
        "filtered_count": len(filtered_tokens),
    }


@app.post("/tfidf")
def tfidf(payload: TextInput):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    sentences = sent_tokenize(text) or [text]

    try:
        vectorizer = TfidfVectorizer(stop_words="english", max_features=50)
        matrix = vectorizer.fit_transform(sentences)
        feature_names = vectorizer.get_feature_names_out()

        # Aggregate max TF-IDF score per word across all sentences
        scores: dict[str, float] = {}
        for i in range(len(sentences)):
            row = matrix[i].toarray()[0]
            for j, score in enumerate(row):
                if score > 0:
                    word = feature_names[j]
                    scores[word] = max(scores.get(word, 0.0), float(score))

        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return {
            "tfidf": [{"word": w, "score": round(s, 4)} for w, s in sorted_scores],
            "sentence_count": len(sentences),
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/ner")
def ner(payload: TextInput):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    doc = nlp(text)
    entities = [
        {
            "text": ent.text,
            "label": ent.label_,
            "description": spacy.explain(ent.label_) or ent.label_,
            "start": ent.start_char,
            "end": ent.end_char,
        }
        for ent in doc.ents
    ]

    # Simple accuracy proxy: ratio of named tokens
    named_tokens = sum(1 for t in doc if t.ent_type_)
    total_tokens = len([t for t in doc if not t.is_space])
    coverage = round(named_tokens / total_tokens, 4) if total_tokens else 0.0

    return {
        "text": text,
        "entities": entities,
        "entity_count": len(entities),
        "metrics": {
            "entity_coverage": coverage,
            "unique_labels": list({e["label"] for e in entities}),
            "model": "en_core_web_sm",
        },
    }


@app.post("/wordnet")
def wordnet_route(payload: TextInput):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    tokens = word_tokenize(text)
    pos_tags = pos_tag(tokens)
    result: dict = {}

    for word, tag in pos_tags:
        if not word.isalpha() or word.lower() in STOP_WORDS:
            continue
        wn_pos = get_wordnet_pos(tag)
        synsets = wordnet.synsets(word.lower(), pos=wn_pos) or wordnet.synsets(word.lower())
        if not synsets:
            continue

        synonyms: set[str] = set()
        antonyms: set[str] = set()
        for syn in synsets[:3]:
            for lemma in syn.lemmas():
                clean = lemma.name().replace("_", " ")
                if clean.lower() != word.lower():
                    synonyms.add(clean)
                for ant in lemma.antonyms():
                    antonyms.add(ant.name().replace("_", " "))

        result[word] = {
            "synonyms": sorted(synonyms)[:8],
            "antonyms": sorted(antonyms)[:4],
            "definition": synsets[0].definition(),
            "pos": tag,
        }

    return {"wordnet": result, "word_count": len(result)}
