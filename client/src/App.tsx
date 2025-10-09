import './App.css'
import MainBackground from './components/MainBackground'
import { Route, Routes, useLocation } from 'react-router-dom'
import Auth from './pages/Auth'
import { useUser } from './contexts/userContext';
import Main from './pages/Main';
import Layout from './pages/Layout';
import Artist from './pages/Artist';
import GlobalModals from './components/GlobalModals';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
	const { user } = useUser();
	const location = useLocation();

	const isAuthPage = location.pathname.startsWith('/auth');


	// useEffect(() => {
	// 	if (location.pathname.startsWith("/song")) useModalStore.getState().open("audio");
	// 	if (location.pathname.split("/")[3] === "upload") useModalStore.getState().open("upload");
	// }, [location]);

	return (
		<>
			{
				!isAuthPage && <Header />
			}
			<MainBackground />
			<GlobalModals />
			<Routes /* location={useNavigationStore.getState().previousLocation || location} */>
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
				</Route>
			</Routes>
			{
				!isAuthPage && <Footer />
			}
		</>
	)
}

export default App
