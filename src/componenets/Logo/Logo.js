import React from 'react';

import burgerLogo from '../../assets/images/burger-logo.png';
import styles from './Logo.scss';

const logo = (props) => (
  <div className={styles.Logo} style={{height: props.height}}>
    <img src={burgerLogo} alt="My Burger"/>
  </div>
);

export default logo;