import KnexType from 'knex'
import globalify from 'sky/utilities/globalify'

declare global {
    namespace Knex {
        function insertOrUpdate<T>(
            knex: KnexType.Knex,
            tableName: string,
            fieldsOnUpdate: string[],
            data: T[]
        ): Promise<number[]>
    }
}

namespace module {
    export async function insertOrUpdate<T>(
        knex: KnexType.Knex,
        tableName: string,
        fieldsOnUpdate: string[],
        data: T[]
    ): Promise<number[]> {
        const sortedFieldsOnUpdate = [...fieldsOnUpdate].sort((a, b) => {
            return a.localeCompare(b)
        })

        if (knex.client.dialect === 'clickhouse') {
            return await knex.raw(knex(tableName).insert(data).toQuery())
        }

        return await knex.raw(
            knex(tableName).insert(data).toQuery() +
                ' ON DUPLICATE KEY UPDATE ' +
                sortedFieldsOnUpdate.map(field => `${field}=VALUES(${field})`).join(', ')
        )
    }
}

globalify.namespace('Knex', module)
