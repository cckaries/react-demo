import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../componenets/UI/Input/Input';
import Button from '../../componenets/UI/Button/Button';
import Spinner from '../../componenets/UI/Spinner/Spinner';
import styles from './Auth.scss';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail Address'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      },
    },
    isSignup: true
  };

  componentDidMount = () => {
    if(!this.props.buildingBurger && this.props.authRedirectpath !== '/') {
      this.props.onSetAuthRedirectpath();
    }
  }

  inputChangeHandler = (e, controlName) => {
    const updatedControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName], {
        value: e.target.value,
        valid: checkValidity (
          e.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      })
    });

    this.setState({ controls: updatedControls });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup
    );
  };

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {isSignup: !prevState.isSignup};
    })
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={e => this.inputChangeHandler(e, formElement.id)}
      />
    ));

    if(this.props.loading) {
      form = <Spinner />
    }

    let errorMessage = null;
    if(this.props.error) {
      errorMessage = (
        <p>{this.props.error.message}</p> 
      );
    }

    let authRedirect = null;
    if(this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectpath} />
    }

    return (
      <div className={styles.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">{this.state.isSignup ? 'Sign Up': 'Log In'}</Button>
        </form>
        <Button 
          btnType="Danger"
          clicked={this.switchAuthModeHandler}> {this.state.isSignup ? 'Log in here if you have an account already.' : 'Sign up here if you don\'t have an account.'}</Button>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectpath: state.auth.authRedirectPath
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectpath: () => dispatch(actions.setAuthRedirectPath('/')),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
