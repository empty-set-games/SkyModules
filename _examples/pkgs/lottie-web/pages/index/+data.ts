import '#/client/imports'
import data from 'sky/platform/web/helpers/data'

export default data(async pageContext => {
    await pageContext.init({
        ns: [],
    })

    return {
        title: 'Lottie Web Example',
        description: '',
    }
})
