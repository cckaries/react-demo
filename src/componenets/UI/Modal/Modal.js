import React, { Component } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

import styles from './Modal.scss';
import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    );
  }

  render() {
    return (
      <Aux>
        {this.props.show ? (
          <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        ) : null}
        <CSSTransition
          in={this.props.show}
          timeout={500}
          mountOnEnter
          unmountOnExit
          classNames={{
            enterActive: styles.ModalOpen,
            exitActive: styles.ModalClosed
          }}
        >
          <div className={styles.Modal}>{this.props.children}</div>
        </CSSTransition>
      </Aux>
    );
  }
}

export default Modal;
