import './App.css'
import MainBackground from './components/MainBackground'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import { UserProvider } from './contexts/userContext';
import Main from './pages/Main';
import Layout from './pages/Layout';
import Artist from './pages/Artist';

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
							element={
								<Layout />
							}
						>
							<Route index element={<Main />} />
							<Route path='/artist/:login' element={<Artist />} />
						</Route>
					</Routes>
				</UserProvider>
			</BrowserRouter>
		</>
	)
}

export default App
