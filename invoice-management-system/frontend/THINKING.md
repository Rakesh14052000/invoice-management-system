# Design Decision
I separated controllers and routes to keep the structure clean and scalable.

# Alternative Approach
I considered using MongoDB but choose SQL because Prisma works well with relational data.

# If tax_amount is added

Database:
- Add taxAmount Float field in Prisma schema
- Run migration

Backend:
- Accept taxAmount in create/update API
- Return total = amount + taxAmount

Frontend:
- Add input field
- Show total in UI
