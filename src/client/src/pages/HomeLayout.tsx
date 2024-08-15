import {Outlet} from 'react-router-dom';
import {Navbar} from '../components';

const HomeLayout: React.FunctionComponent = () => {
    return (
        <>
            <Navbar/>
            <section style={{}}>
                <Outlet/>
            </section>
        </>
    );
}

export default HomeLayout;