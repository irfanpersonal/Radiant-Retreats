import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

import store from './store';
import {Provider} from 'react-redux';

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

const rootElement = document.querySelector('#root') as HTMLDivElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
	<Provider store={store}>
		<Elements stripe={stripePromise}>
			<App/>
		</Elements>
		<ToastContainer position='top-center'/>
	</Provider>
);