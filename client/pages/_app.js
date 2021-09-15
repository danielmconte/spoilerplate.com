import 'bootstrap/dist/css/bootstrap.css';
import AxiosCall from '../api/build-client';
import Header from '../components/header';


const AppComponent = ({ Component, pageProps, currentUser }) => {
    return <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
        </div>
};

AppComponent.getInitialProps = async (appContext) => {
    const client = AxiosCall(appContext.ctx);
    const { data } = await client.get('/api/users/currentUser');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    };

    return {
        pageProps,
        ...data
    };
};

export default AppComponent;