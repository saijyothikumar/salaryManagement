import logging
import random
import time
from datetime import date, timedelta
from pathlib import Path
import sys

# Ensure backend root is in sys.path
backend_dir = Path(__file__).resolve().parents[1]
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlmodel import Session, SQLModel, create_engine, select, delete
from app.core.database import DB_PATH, engine
from app.models.employee import Employee

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("salary_management.seed")

FIRST_NAMES = [
    "Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Pat", "Riley", "Dakota", "Reese",
    "Aarav", "Priya", "Rahul", "Ananya", "Vikram", "Sneha", "Rohan", "Kavya", "Arjun", "Neha",
    "Liam", "Emma", "Noah", "Olivia", "William", "Ava", "James", "Sophia", "Oliver", "Isabella",
    "Hans", "Freja", "Lucas", "Lukas", "Mia", "Elena", "Mateo", "Sofia", "Kenji", "Yuki",
    "Haruto", "Yui", "Sora", "Aoi", "Tariq", "Fatima", "Zaid", "Zainab", "Chen", "Wei"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Sharma", "Patel", "Verma", "Rao", "Nair", "Kulkarni", "Gupta", "Joshi", "Singh", "Reddy",
    "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Tanaka", "Sato", "Suzuki", "Takahashi", "Watanabe",
    "Dupont", "Bernard", "Petit", "Robert", "Richard", "Kim", "Lee", "Park", "Choi", "Zhang"
]

COUNTRY_CONFIG = {
    "US": {"currency": "USD", "min_sal": 60000, "max_sal": 180000, "weight": 35},
    "UK": {"currency": "GBP", "min_sal": 45000, "max_sal": 130000, "weight": 15},
    "India": {"currency": "INR", "min_sal": 1200000, "max_sal": 4500000, "weight": 25},
    "Germany": {"currency": "EUR", "min_sal": 50000, "max_sal": 140000, "weight": 10},
    "Japan": {"currency": "JPY", "min_sal": 6000000, "max_sal": 16000000, "weight": 8},
    "Canada": {"currency": "CAD", "min_sal": 55000, "max_sal": 150000, "weight": 7},
}

DEPARTMENTS = [
    "Engineering", "Product", "Human Resources", "Finance", 
    "Sales", "Legal", "Operations", "Marketing"
]

JOB_TITLES = {
    "Engineering": ["Software Engineer", "Senior Developer", "Tech Lead", "QA Specialist", "DevOps Lead", "Engineering Manager"],
    "Product": ["Product Specialist", "Product Manager", "UX Researcher", "UI/UX Designer", "Director of Product"],
    "Human Resources": ["HR Coordinator", "HR Generalist", "Recruiter", "Senior HR Business Partner", "VP of HR"],
    "Finance": ["Financial Analyst", "Accountant", "Senior Auditor", "Finance Manager", "VP of Finance"],
    "Sales": ["Sales Development Rep", "Account Executive", "Sales Manager", "Customer Success Lead", "Director of Sales"],
    "Legal": ["Legal Assistant", "Corporate Counsel", "Compliance Officer", "Senior Legal Counsel"],
    "Operations": ["Operations Assistant", "Process Analyst", "Operations Manager", "Director of Operations"],
    "Marketing": ["Content Strategist", "SEO Specialist", "Marketing Manager", "Growth Lead", "CMO"]
}

STATUSES = ["active", "active", "active", "active", "active", "active", "active", "active", "on_leave", "terminated"]

START_DATE = date(2018, 1, 1)
END_DATE = date(2026, 1, 1)
TOTAL_DAYS = (END_DATE - START_DATE).days


def seed_employees(total_count: int = 10000, batch_size: int = 1000) -> None:
    logger.info(f"Starting seed process for {total_count} employees...")
    start_time = time.time()

    # Re-create database tables cleanly
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Clear existing data
        existing_count = session.exec(select(Employee)).all()
        if existing_count:
            logger.info(f"Clearing existing {len(existing_count)} records...")
            session.exec(delete(Employee))
            session.commit()

        countries = list(COUNTRY_CONFIG.keys())
        country_weights = [COUNTRY_CONFIG[c]["weight"] for c in countries]

        records: list[Employee] = []

        for i in range(1, total_count + 1):
            emp_code = f"EMP-{i:05d}"
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            email = f"{first_name.lower()}.{last_name.lower()}.{i}@acme.org"

            country = random.choices(countries, weights=country_weights, k=1)[0]
            cfg = COUNTRY_CONFIG[country]
            currency = cfg["currency"]
            base_salary = round(random.uniform(cfg["min_sal"], cfg["max_sal"]), 2)

            department = random.choice(DEPARTMENTS)
            job_title = random.choice(JOB_TITLES[department])
            status = random.choice(STATUSES)

            joined_at = START_DATE + timedelta(days=random.randint(0, TOTAL_DAYS))

            emp = Employee(
                employee_code=emp_code,
                first_name=first_name,
                last_name=last_name,
                email=email,
                department=department,
                country=country,
                job_title=job_title,
                base_salary=base_salary,
                currency=currency,
                status=status,
                joined_at=joined_at,
            )
            records.append(emp)

            if len(records) >= batch_size:
                session.add_all(records)
                session.commit()
                logger.info(f"Committed {i}/{total_count} employees...")
                records.clear()

        if records:
            session.add_all(records)
            session.commit()
            logger.info(f"Committed final {len(records)} employees...")

    elapsed = time.time() - start_time
    logger.info(f"Successfully seeded {total_count} employees in {elapsed:.2f} seconds!")


if __name__ == "__main__":
    seed_employees()
