'use client'

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-4xl font-serif font-bold text-primary mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <h2 className="text-2xl font-serif font-semibold text-primary mb-4">
            Environment Variables
          </h2>
          <p className="text-text-light mb-4">
            Configure your environment variables in your deployment platform (Vercel) or
            .env.local file.
          </p>
          <div className="bg-background-dark rounded-xl p-4 font-mono text-sm">
            <div className="space-y-2">
              <div>
                <span className="text-secondary">DATABASE_URL</span>
                <span className="text-text-light"> - PostgreSQL connection string</span>
              </div>
              <div>
                <span className="text-secondary">BLOB_READ_WRITE_TOKEN</span>
                <span className="text-text-light"> - Vercel Blob Storage token</span>
              </div>
              <div>
                <span className="text-secondary">ADMIN_USERNAME</span>
                <span className="text-text-light"> - Admin dashboard username</span>
              </div>
              <div>
                <span className="text-secondary">ADMIN_PASSWORD</span>
                <span className="text-text-light"> - Admin dashboard password</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8">
          <h2 className="text-2xl font-serif font-semibold text-primary mb-4">
            Database Setup
          </h2>
          <p className="text-text-light mb-4">
            Run the following commands to set up your database:
          </p>
          <div className="bg-background-dark rounded-xl p-4 font-mono text-sm space-y-2">
            <div>
              <span className="text-text-light"># Install dependencies</span>
            </div>
            <div>
              <span className="text-secondary">npm install</span>
            </div>
            <div className="mt-4">
              <span className="text-text-light"># Generate Prisma Client</span>
            </div>
            <div>
              <span className="text-secondary">npx prisma generate</span>
            </div>
            <div className="mt-4">
              <span className="text-text-light"># Push schema to database</span>
            </div>
            <div>
              <span className="text-secondary">npx prisma db push</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8">
          <h2 className="text-2xl font-serif font-semibold text-primary mb-4">
            Deployment
          </h2>
          <p className="text-text-light mb-4">
            This application is ready to deploy on Vercel. Make sure to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-light ml-4">
            <li>Connect your GitHub repository to Vercel</li>
            <li>Add all environment variables in Vercel dashboard</li>
            <li>Set up a PostgreSQL database (Vercel Postgres or external)</li>
            <li>Configure Vercel Blob Storage and add the token</li>
            <li>Deploy and run database migrations</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
