## ⚙️ ADK Server Setup

### Install and Run Backend
```bash
cd adk-server
pip install -r requirements.txt
cp .env.example .env
# Edit the .env file and add necessary credentials
adk run <folder_name>
```

### Run API Server Only
```bash
cd server
adk api_server
adk api_server --allow_origins http://localhost:3000
```

### Run Dev UI (ADK web)
```bash
cd server
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
