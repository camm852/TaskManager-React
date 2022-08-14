import React from 'react';
import SocketContext from '../context/SocketProvider';

export default function useSocket() {
	return React.useContext(SocketContext);
}
