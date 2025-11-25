




<img width="8387" height="4302" alt="Untitled-2025-09-29-0223" src="https://github.com/user-attachments/assets/e0ca93ae-609c-4893-aa9a-600e054078fa" />



<img width="1850" height="935" alt="Screenshot from 2025-11-25 09-14-35" src="https://github.com/user-attachments/assets/26f15e2c-52ae-405b-8b7f-da51628bb148" />

<img width="1850" height="935" alt="Screenshot from 2025-11-25 09-14-52" src="https://github.com/user-attachments/assets/3c4b8326-225b-4788-a457-a386549e5851" />

<img width="1850" height="935" alt="Screenshot from 2025-11-25 09-27-17" src="https://github.com/user-attachments/assets/6b87fe23-3740-4e18-b068-9ea8cb78efb4" />


# Setup Guidelines will be updated soon...

Tech Stack

- Frontend: Next.js 15, Typescript, Tailwind, Shadcn UI
- Backend: Node.js, Typescript, Express JS
- Message Queue: Apache Kafka
- Database: PostgreSQL (with Prisma ORM)
- Containerization: Docker
- Monorepo Tool: Turborepo


Transactional outbox pattern
- 4 backends -> Backend (primary) -> hooks (for managing all executions) -> Processor (listen to db outbox) -> Worker (execution of services)
- 1 Frontend 
