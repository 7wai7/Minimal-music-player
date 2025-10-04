import './App.css'
import MainBackground from './components/MainBackground'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Auth from './pages/Auth'
import { useUser } from './contexts/userContext';
import Main from './pages/Main';
import Layout from './pages/Layout';
import Artist from './pages/Artist';
import type { ModalType } from './types/modal';

function App() {
	const { user } = useUser();
	const location = useLocation();
	const navigate = useNavigate();
	const previousLocation = location.state?.previousLocation as Location;
	const modalType = location.state?.modalType as ModalType | undefined;
	const song = location.state?.song;

	return (
		<>
			<MainBackground />
			<Routes location={previousLocation || location}>
				<Route
					path="/auth"
					element={<Auth />}
				/>

				<Route
					path="/"
					element={
						<Layout
							previousLocation={previousLocation}
							modalType={modalType}
						/>
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

					{
						user && (
							<Route
								path="/artist/:login/upload"
								element={
									<Artist />
								}
							/>
						)
					}

					{/* <Route
						path="/playlist"
						element={
							<Main />
						}
					/> */}
				</Route>
			</Routes>
		</>
	)
}

export default App
