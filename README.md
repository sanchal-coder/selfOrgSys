This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


### Data flow

1. Users submit raw text through the UI.
2. A backend API route receives the input.
3. Lightweight classification logic infers:
   - Category (Incident, Issue, Event, Log, Task, Note)
   - Severity
4. Both **raw input** and **derived metadata** are stored together.
5. The frontend retrieves:
   - A feed of recent signals
   - Basic analytics (counts by category)
6. The UI presents signals and insights in a simple dashboard.

### Data model

The system stores:
- Raw, unstructured text
- Derived metadata in a flexible structure
- Timestamps for analytics and trends

This design allows the classification logic to evolve without changing the data model.

---

## Trade-offs made

- Used **rule-based classification** instead of ML or LLMs due to:
  - Lack of large labeled datasets
  - Time constraints
  - Need for explainability and robustness
- Chose **simple analytics** over advanced dashboards to focus on clarity
- Avoided authentication, background jobs, and complex workflows to keep the system lightweight

If a large historical dataset were available, traditional **ML classifiers** could be trained.  
Alternatively, the system can be upgraded to use **LLMs with vector embeddings** for semantic classification and search.  
The current architecture supports these upgrades without major changes.

