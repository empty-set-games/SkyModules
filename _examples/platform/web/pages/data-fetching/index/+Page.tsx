import PageLayout from '#/layouts/PageLayout'
import useData from 'sky/platform/web/renderer/useData'

import StarWarsPageData from './+data'

export default function Page(): ReactNode {
    const { isLoading, movies } = useData(StarWarsPageData)

    if (isLoading) {
        return <PageLayout>Loading...</PageLayout>
    }

    if (!movies) {
        return <PageLayout>Error while loading movies</PageLayout>
    }

    return (
        <PageLayout>
            <h1>Star Wars Movies</h1>
            <ol>
                {movies.map(({ id, title, release_date }) => (
                    <li key={id}>
                        <a href={`/star-wars/${id}`}>{title}</a> ({release_date})
                    </li>
                ))}
            </ol>
            <p>
                Source:{' '}
                <a href="https://brillout.github.io/star-wars/">brillout.github.io/star-wars</a>.
            </p>
            <p>
                Data can be fetched by using the <code>data()</code> hook.
            </p>
        </PageLayout>
    )
}
