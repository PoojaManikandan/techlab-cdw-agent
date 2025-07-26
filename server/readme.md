Steps to install:

Use python version 3.12

```
cd server
pyenv local 3.12
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

---
Steps to run:

```
uvicorn app:app --reload --port 8080
```
### Deploy to AZURE
```

chmod +x deploy.sh 
./deploy.sh

````