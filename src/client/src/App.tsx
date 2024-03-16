import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {AddListing, ApplyForHost, Auth, CashOut, Checkout, Earnings, Error, Home, HomeLayout, HostRequest, Listing, Profile, ProtectedRoute, Reservation, SingleCashOut, SingleHostRequest, SingleListing, SingleReservation, SingleUser, Stats, Success, User} from './pages';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from './store';
import {Loading} from './components';
import {showCurrentUser} from './features/user/userThunk';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout/>,
		errorElement: <Error/>,
		children: [
			{
				index: true,
				element: <Home/>
			},
			{
				path: 'profile',
				element: <ProtectedRoute role={['guest', 'host', 'admin']}><Profile/></ProtectedRoute>
			},
			{
				path: 'profile/apply-for-host',
				element: <ProtectedRoute role={['guest']}><ApplyForHost/></ProtectedRoute>
			},
			{
				path: 'host-request',
				element: <ProtectedRoute role={['admin']}><HostRequest/></ProtectedRoute>
			},
			{
				path: 'host-request/:id',
				element: <ProtectedRoute role={['admin']}><SingleHostRequest/></ProtectedRoute>
			},
			{
				path: 'add-listing',
				element: <ProtectedRoute role={['host']}><AddListing/></ProtectedRoute>
			},
			{
				path: 'listing',
				element: <Listing/>
			},
			{
				path: 'listing/:id',
				element: <SingleListing/>
			},
			{
				path: 'checkout',
				element: <Checkout/>
			},
			{
				path: 'success',
				element: <Success/>
			},
			{
				path: 'reservation',
				element: <ProtectedRoute role={['guest', 'host']}><Reservation/></ProtectedRoute>
			},
			{
				path: 'reservation/:id',
				element: <ProtectedRoute role={['guest', 'host']}><SingleReservation/></ProtectedRoute>
			},
			{
				path: 'user',
				element: <User/>
			},
			{
				path: 'user/:id',
				element: <SingleUser/>
			},
			{
				path: 'stats',
				element: <ProtectedRoute role={['admin']}><Stats/></ProtectedRoute>
			},
			{
				path: 'earnings',
				element: <ProtectedRoute role={['host']}><Earnings/></ProtectedRoute>
			},
			{
				path: 'cash-out',
				element: <ProtectedRoute role={['admin']}><CashOut/></ProtectedRoute>
			},
			{
				path: 'cash-out/:id',
				element: <ProtectedRoute role={['admin', 'host']}><SingleCashOut/></ProtectedRoute>
			}
		]
	},
	{
		path: '/auth',
		element: <Auth/>,
		errorElement: <Error/>
	}
])

const App: React.FunctionComponent = () => {
	const dispatch = useDispatch<useDispatchType>();
	const {globalLoading} = useSelector((store: useSelectorType) => store.user);
	const {location} = useSelector((store: useSelectorType) => store.navigation);
	React.useEffect(() => {
		dispatch(showCurrentUser());
	}, []);
	React.useEffect(() => {
		if (window.location.pathname !== location) {
			router.navigate(location);
		}
	}, [location]);
	if (globalLoading) {
		return (
			<Loading title="Loading Application" position='center'/>
		);
	}
	return (
		<RouterProvider router={router}/>
	);
}

export default App;