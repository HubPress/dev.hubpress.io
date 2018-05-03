import { APPLICATION_INITIALIZE_ROUTES } from "~/hubpress-plugins/constants";

export default ({store, app}) => {
    // Property routes is define in the ~/router.js file
    console.log('3000 ', app.router.routes)
    store.commit(APPLICATION_INITIALIZE_ROUTES, app.router.routes)
}