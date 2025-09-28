import './App.css'
import MainBackground from './components/MainBackground'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import { UserProvider } from './contexts/userContext';
import Main from './pages/Main';
import Page from './pages/Page';

function App() {
	return (
		<>
			<BrowserRouter>
				<UserProvider>
					<MainBackground />
					<Routes>
						<Route
							path="/auth"
							element={<Auth />}
						/>

						<Route
							path="/"
							element={<Page children={<Main />}/>}
						/>
					</Routes>
				</UserProvider>
			</BrowserRouter>
		</>
	)
}

export default App
