import React, { Component } from 'react';
import { connect } from 'react-redux'

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../componenets/Burger/Burger';
import BuildControls from '../../componenets/Burger/BuildControls/BuildControls';
import Modal from '../../componenets/UI/Modal/Modal';
import OrderSummary from '../../componenets/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../componenets/UI/Spinner/Spinner';
import * as burgerBuilderActions from '../../store/actions/index';
import axios from '../../axios-orders';

export class BurgerBuilder extends Component {
  state = {
    purchasing: false,
  };

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      }).reduce((sum, el) => {
        return sum + el;
      }, 0);

    return sum > 0;
  }

  componentDidMount() {
    // console.log(this.props);
    this.props.onInitIngredients();
  }

  purchaseHandler = () => {
    if(this.props.isAuthenticated) {
      this.setState({purchasing: true});
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
  }

  purchaseCancelhandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
  }

  render() {
    const disabledInfo = {
      ...this.props.ings
    };

    for(let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.props.error ? <p>Ingredient cannot be loaded!</p> : <Spinner />;

    if(this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls 
            isAuth = {this.props.isAuthenticated}
            ingredientAdded={this.props.onAddIngredient} 
            ingredientRemoved={this.props.onRemoveIngredient} 
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            price={this.props.price} />
        </Aux>
      );
      orderSummary = <OrderSummary 
        ingredients={this.props.ings}
        price={this.props.price}
        purchaseCanceled={this.purchaseCancelhandler}
        purchaseContinued={this.purchaseContinueHandler} />;
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelhandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAddIngredient: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
    onRemoveIngredient: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
    onSetAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));