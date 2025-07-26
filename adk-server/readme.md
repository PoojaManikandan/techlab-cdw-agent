## ⚙️ ADK Server Setup

Use python version 3.12

```bash
pyenv local 3.12
```

### Install and Run Backend
```bash
cd adk-server

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
# Edit the .env file and add necessary credentials
adk run <folder_name>
```

### Run API Server Only
```bash
adk api_server --allow_origins http://localhost:3000
```

### Run Dev UI (ADK web)
```bash
adk web
```

### Testing Reference
Use the resource - [ADK Testing](https://google.github.io/adk-docs/get-started/testing/#local-testing)


### Running Eval
adk eval \
    --config_file_path eval/data/test_config.json \
    --print_detailed_results \
    cdw_agent \
    eval/data/evalset0fc08a.evalset.json

---

## Data pipeline for Products in CDW Site

### Create vector store and vector search index
```bash
cd adk-server
python products_vectorstore_pipeline/data_pipeline.py
```
