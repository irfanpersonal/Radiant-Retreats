import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {showCurrentUser} from './features/user/userThunk';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {About, AddListing, Auth, Checkout, EditListing, Error, Home, HomeLayout, Landing, Profile, ProtectedRoute, Reservations, SingleListing, Success} from './pages';

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
				path: 'about',
				element: <About/>
			},
			{
				path: 'auth',
				element: <Auth/>
			},
			{
				path: 'add-listing',
				element: <ProtectedRoute role={['owner']}><AddListing/></ProtectedRoute>
			},
			{
				path: 'edit-listing/:id',
				element: <ProtectedRoute role={['owner']}><EditListing/></ProtectedRoute>
			},
			{
				path: 'reservations',
				element: <ProtectedRoute role={['customer']}><Reservations/></ProtectedRoute>
			},
			{
				path: 'checkout',
				element: <ProtectedRoute role={['customer']}><Checkout/></ProtectedRoute>
			},
			{
				path: 'success',
				element: <ProtectedRoute role={['customer']}><Success/></ProtectedRoute>
			},
			{
				path: 'listing/:id',
				element: <SingleListing/>
			},
			{
				path: 'profile',
				element: <ProtectedRoute role={['customer', 'owner']}><Profile/></ProtectedRoute>
			}
		]
	},
	{
		path: '/landing',
		element: <Landing/>
	}
]);

const App = () => {
	const {location} = useSelector(store => store.navigation)
	const {isLoading} = useSelector(store => store.user);
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(showCurrentUser());
	}, []);
	React.useEffect(() => {
		if (window.location.pathname !== location) {
			router.navigate(location);
		}
	}, [location]);
	if (isLoading) {
		return (
			<h1>Loading...</h1>
		);
	}
	return (
		<RouterProvider router={router}/>
	);
}

export default App;