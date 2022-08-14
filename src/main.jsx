import React from 'react';
import ReactDOM from 'react-dom/client';
import RoutesApp from './routes/RoutesApp';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthProvider';
import { store } from './redux/Store';
import { Provider } from 'react-redux';
import { SocketProvider } from './context/SocketProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
	<AuthProvider>
		<Provider store={store}>
			<SocketProvider>
				<RoutesApp>
					<App />
				</RoutesApp>
			</SocketProvider>
		</Provider>
	</AuthProvider>
);
