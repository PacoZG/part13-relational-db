require('dotenv').config()

const PORT: string | number = process.env.PORT || 3001
const DATABASE_URL: string | undefined = process.env.DATABASE_URL
const SECRET: string | undefined = process.env.SECRET

export { PORT, DATABASE_URL, SECRET }

