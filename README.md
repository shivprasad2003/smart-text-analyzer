# Smart Text Analyzer — NLP Web App

A full-stack NLP web application built with **FastAPI** (backend) and **React.js** (frontend).

## Features

| Feature | Endpoint | Library |
|---|---|---|
| Tokenization & POS Tagging | `POST /analyze` | NLTK |
| Lemmatization | `POST /analyze` | NLTK WordNetLemmatizer |
| Stopword Removal | `POST /analyze` | NLTK |
| TF-IDF Scores | `POST /tfidf` | scikit-learn |
| Named Entity Recognition | `POST /ner` | spaCy |
| Synonyms & Antonyms | `POST /wordnet` | NLTK WordNet |

---

## Project Structure

```
smart-text-analyzer/
├── backend/
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Global styles
│   │   ├── index.js           # React entry point
│   │   ├── index.css
│   │   └── components/
│   │       ├── TokensSection.js
│   │       ├── PosTagsSection.js
│   │       ├── LemmasSection.js
│   │       ├── TfidfSection.js
│   │       ├── NerSection.js
│   │       └── WordnetSection.js
│   └── package.json
└── README.md
```

---

## Setup & Run

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** and **npm**

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # macOS / Linux
# OR
venv\Scripts\activate           # Windows

# Install Python dependencies
pip install -r requirements.txt

# Download the spaCy English model
python -m spacy download en_core_web_sm
```

**Start the backend server:**

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`
Interactive API docs: `http://localhost:8000/docs`

---

### 2. Frontend Setup

Open a **new terminal window/tab**.

```bash
cd frontend

# Install Node dependencies
npm install

# Start the React development server
npm start
```

The app will open at: `http://localhost:3000`

---

## API Endpoints

### `GET /`
Health check. Returns API status.

### `POST /analyze`
Performs tokenization, stopword removal, POS tagging, and lemmatization.

**Request:**
```json
{ "text": "Barack Obama was born in Hawaii." }
```

**Response:**
```json
{
  "tokens": ["Barack", "Obama", "was", "born", "in", "Hawaii", "."],
  "filtered_tokens": ["Barack", "Obama", "born", "Hawaii"],
  "pos_tags": [{"word": "Barack", "pos": "NNP"}, ...],
  "lemmas": [{"word": "was", "lemma": "be", "pos": "VBD"}, ...],
  "token_count": 7,
  "filtered_count": 4
}
```

### `POST /tfidf`
Returns TF-IDF scores for terms in the text.

### `POST /ner`
Returns named entities with labels, positions, and accuracy metrics.

### `POST /wordnet`
Returns synonyms, antonyms, and definitions for content words.

---

## Error Handling

- All endpoints return `400 Bad Request` for empty input.
- The frontend displays inline error messages if the backend is unreachable.
- Backend uses Pydantic for request validation.

---

## Tech Stack

**Backend:** Python · FastAPI · Uvicorn · NLTK · spaCy · scikit-learn  
**Frontend:** React 18 · Axios · CSS3

---

## Troubleshooting

**`OSError: [E050] Can't find model 'en_core_web_sm'`**  
Run: `python -m spacy download en_core_web_sm`

**CORS error in browser**  
Make sure the backend is running on port `8000` and the frontend on port `3000`.

**`npm start` fails**  
Run `npm install` first inside the `frontend/` directory.
