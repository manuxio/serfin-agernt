import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './style.scss';
// import FuelSavingsForm from '../FuelSavingsForm';

export class ShimController extends React.Component {
  componentDidMount() {
  }
  render() {
    const {
      children,
      onlineStatus
    } = this.props;
    console.log('onlineStatus', onlineStatus);
    return (
      <>
        {
          onlineStatus
          ? <>
            { children }
          </>
          : (
            <>
              <div className="shim"></div>
              {children}
            </>
          )
        }
      </>
    );
  }
}

ShimController.propTypes = {
  children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
  ]),
  onlineStatus: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    onlineStatus: state.onlineStatus
  };
}

export default connect(
  mapStateToProps
)(ShimController);
