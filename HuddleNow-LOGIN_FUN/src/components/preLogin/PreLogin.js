import React from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import { PRE_LOGIN_PATH, UNKNOWN_PATH, LOGIN_PATH, SIGNUP_PATH } from 'routes/routes';
import LoginContainer from 'components/login/LoginContainer';
import SignupContainer from 'components/signup/SignupContainer';

const PreLogin = () => {

    return(
        <>
            <Routes>
                <Route path={PRE_LOGIN_PATH} element={<Navigate replace to={LOGIN_PATH} />} />
                <Route path={UNKNOWN_PATH} element={<Navigate replace to={LOGIN_PATH} />} />                
                <Route path={LOGIN_PATH} element={<LoginContainer />} />
                <Route path={SIGNUP_PATH} element={<SignupContainer />} />
            </Routes>
        </>
    )
};

export default PreLogin;