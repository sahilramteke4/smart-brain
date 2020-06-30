import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css';
import brain from './logo.png';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			 <Tilt className="Tilt br3 shadow-2" options={{ max : 50 }} style={{ height: 150, width: 150 }} >
			 <div className="Tilt-inner pa3"> <img style={{paddingTop: '8px'}} alt='logo' src={brain} /> </div>
			 </Tilt>
		</div>
		);
}

export default Logo;