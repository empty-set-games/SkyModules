export {}

declare global {
    namespace ClickHouse {
        const useDatabase: (connection: ClickHouse, name: string) => Promise<void>
    }
}

Object.assign(Mysql, {
    async useDatabase(connection: ClickHouse, name: string): Promise<void> {
        await connection.query(`USE \`${name}\``)
    },
})
