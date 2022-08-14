import React from 'react';
import Alert from '../components/Alert';
import login from '../../public/resources/login2.png';
import clientAxios from '../config/clientAxios';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function ConfirmAccount() {
	const [alert, setAlert] = React.useState({
		msg: '',
		error: false,
	});
	const navigate = useNavigate();
	const params = useParams();
	const { token } = params;

	React.useEffect(() => {
		const confirmAccount = async () => {
			try {
				const response = await clientAxios.get(`/users/confirm/${token}`);
				const { data } = response;
				setAlert({ msg: data.msg, error: false });
			} catch (error) {
				const { msg } = error.response.data;
				setAlert({ msg: msg, error: true });
			}
		};
		confirmAccount();
	}, []);

	return (
		<>
			<h1 className='text-sky-600 font-black text-5xl text-center capitalize'>
				Confirm your account, start manage your
				<br />
				<span className='text-slate-700 text-6xl block py-2'>Projects</span>
			</h1>
			<div className='mt-20'>
				{alert.msg && <Alert error={alert.error}>{alert.msg}</Alert>}
			</div>
			{alert.msg && !alert.error && (
				<div className='mt-10 text-center'>
					<div className='justify-center flex'>
						<Link to='/'>
							<img src={login} />
						</Link>
					</div>
					<div className='mt-5'>
						<button
							className='bg-sky-500 text-gray-100 p-3 w-1/2 rounded-md tracking-wide
												font-semibold focus:outline-none focus:shadow-outline hover:bg-sky-600
												shadow-lg transition-colors duration-500 ease-out'
							onClick={() => {
								navigate('/');
							}}
						>
							Log In
						</button>
					</div>
				</div>
			)}
		</>
	);
}
