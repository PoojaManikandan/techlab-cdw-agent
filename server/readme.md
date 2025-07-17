Steps to install:

```
cd server
pyenv local 3.12
python3 -m venv venv
source venv/bin/activate
python3 install -r requirements.txt
```

---
Steps to run:

```
uvicorn main:app --reload
```
