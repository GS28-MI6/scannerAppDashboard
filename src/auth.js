import React from 'react';
import { connect } from 'react-redux';
import {validateUser} from './actions/postActions';

function Auth() {
    if (this.props.validateUser()){
        return true
    }else{
        return false
    }
}

export default connect (null, {validateUser})(Auth)