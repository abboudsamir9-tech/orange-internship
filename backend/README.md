# Backend

Django + Django REST Framework API for the AI Internship Management Platform.

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

Development uses SQLite by default. Set `DATABASE_NAME` (and related vars) in `.env` to use PostgreSQL.

## Seed accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Mentor | mentor@company.com | mentor123 |
| Intern | intern@company.com | intern123 |

## API base

- Auth: `/api/auth/`
- Accounts: `/api/accounts/`
- Programs: `/api/programs/`
- Roadmaps: `/api/roadmaps/`
- Tasks: `/api/tasks/`
- Submissions: `/api/submissions/`
- Reports: `/api/reports/`

## Tests

```bash
python manage.py test tests
```
