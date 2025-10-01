import './App.css'
import MainBackground from './components/MainBackground'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Auth from './pages/Auth'
import { UserProvider } from './contexts/userContext';
import Main from './pages/Main';
import Layout from './pages/Layout';
import Artist from './pages/Artist';

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const previousLocation = location.state?.previousLocation;
	const song = location.state?.song;

	return (
		<>
			<UserProvider>
				<MainBackground />
				<Routes location={previousLocation || location}>
					<Route
						path="/auth"
						element={<Auth />}
					/>

					<Route
						path="/"
						element={
							<Layout previousLocation={previousLocation}/>
						}
					>
						<Route index element={<Main />} />
						<Route path='/artist/:login' element={<Artist />} />

						<Route
							path="/song/:id"
							element={
								<Main />
							}
						/>
					</Route>
				</Routes>
			</UserProvider>
		</>
	)
}

export default App
