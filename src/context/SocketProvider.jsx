import React from 'react';
import io from 'socket.io-client';

const SocketContext = React.createContext();

export function SocketProvider({ children }) {
	const [socket, setSocket] = React.useState();
	const [emitSocket, setEmitSocket] = React.useState();

	React.useEffect(() => {
		setSocket(io(import.meta.env.VITE_API_URL));
	}, []);

	const newTaskSocket = (task) => {
		//send task to server-socket
		socket.emit('newTask', task);
		const randomString = `${Math.random()}`;
		setEmitSocket(randomString);
	};

	const deleteTaskSocket = (task) => {
		//send task to server-socket
		socket.emit('deleteTask', task);
		const randomString = `${Math.random()}`;
		setEmitSocket(randomString);
	};

	const updateTaskSocket = (task) => {
		console.log(task)
		socket.emit('updateTask', task);
		const randomString = `${Math.random()}`;
		setEmitSocket(randomString);
	};

	const changeStateSocket = (task) => {
		// console.log(task);
		socket.emit('changeStateTask', task);
		const randomString = `${Math.random()}`;
		setEmitSocket(randomString);
	};


	return (
		<SocketContext.Provider
			value={{
				newTaskSocket,
				deleteTaskSocket,
				updateTaskSocket,
				changeStateSocket,
				emitSocket,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
}

export default SocketContext;
