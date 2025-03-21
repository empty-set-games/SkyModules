import data from 'sky/platform/web/helpers/data'

const ErrorPageData = data(async pageContext => {
    await pageContext.init({
        ns: [],
    })

    return {
        title: pageContext.is404 ? 'Not Found' : 'Error',
        description: '',
    }
})

export default ErrorPageData
