import { createClient } from 'pkgs/@clickhouse/client-web'

const client = createClient({
    url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER ?? 'default',
    password: process.env.CLICKHOUSE_PASSWORD ?? '',
})

const resultSet = await client.query({
    query: 'SELECT * FROM my_table',
    format: 'JSONEachRow',
})
const dataset = await resultSet.text()
logConsole(dataset)
