import React, {useEffect, useState} from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { errorHandler } from '../../requests/errorHandler';
import { login_admin} from '../../requests/authRequest';

import { Button, Spin } from 'antd';

const apiUrl = process.env.BACKEND_URL


function Login(props) {
  const {setGlobalUser} = props;
  const navigate = useNavigate();
  const ua = navigator.userAgent.toLowerCase();
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email:localStorage.getItem('rememberedFormData') ? JSON.parse(localStorage.getItem('rememberedFormData')).email:"", 
    password:localStorage.getItem('rememberedFormData') ? JSON.parse(localStorage.getItem('rememberedFormData')).password:""
  })
  
  const [rememberedForm, setRememberedForm] = useState(localStorage.getItem('rememberedFormData')?true:false)


  const handlePasswordChange = (e) => {
    setLoginForm({
      email:loginForm.email,
      password:e.target.value
    })
    if(rememberedForm){
      localStorage.setItem('rememberedFormData',JSON.stringify({
        ...JSON.parse(localStorage.getItem('rememberedFormData')),
        password:e.target.value
      }))
    }
  }

  const handleEmailChange = (e) => {
    setLoginForm({
      email:e.target.value,
      password:loginForm.password
    })
    if(rememberedForm){
      localStorage.setItem('rememberedFormData',JSON.stringify({
        ...JSON.parse(localStorage.getItem('rememberedFormData')),
        email:e.target.value
      }))
    }
  }

  const handleRememeberForm = (e) => {
    setRememberedForm(!rememberedForm);
    if(localStorage.getItem('rememberedFormData')){
      localStorage.removeItem('rememberedFormData')   
    }
    else{
      localStorage.setItem('rememberedFormData', JSON.stringify(loginForm))
    }
  }

const handleLogin = async(e) => {
    e.preventDefault()
    let isEmail = false;
    // if(loginForm.email.indexOf('@') === -1){
    //   // alert("Username login is not open, please login by email!")
    // }else{
    //   const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    //   if (!regex.test(loginForm.email) || loginForm.email === '') {
    //     alert('Please input correct email address!')
    //     return;
    //   }
    //   isEmail = true;
    // }
    try{
      const d = {password: loginForm.password, username: loginForm.email};
      setIsLoading(true)
      const data = await login_admin(d)
      setIsLoading(false)
      localStorage.setItem('user', JSON.stringify(data))
      setGlobalUser(data);
      navigate('/home')
    }catch(err){
      errorHandler(err);
    }finally{
      setIsLoading(false)
    }
}

  const handleGoogleLoginFailure = (error) => {
    alert('Google internal server error:', error);
  };

  return (
    <div className='container mx-auto flex items-center justify-center h-screen w-2/5'>
      <form className='login w-full'>
        <Spin fullscreen spinning={isLoading}>Loading...</Spin>
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <div className='flex justify-center'>
            <h1>
              Ruito Admin Login</h1>
          </div>
          <div className='login-email'>
            <div className='login-tag'>Username</div>
            <div>
              <input className='login-input' type="text" onChange={handleEmailChange} value={loginForm.email}/>
            </div>
          </div>
          <div className='login-password'>
            <div className='login-tag'>Password</div>
            <div>
              <input className='login-input' type="password" onChange={handlePasswordChange} value={loginForm.password}/>
            </div>
          </div>
          <div className="hover:text-blue-300	cursor-pointer text-blue-600 mt-3">
              <a >Forgot your password?</a>
          </div>
          <div className="container flex mt-4">
            <input type="checkbox" style={{marginRight:"20px"}} onChange={handleRememeberForm} checked={rememberedForm}/>
            <div>
              Remember Username and Password
            </div>
          </div>
          <br/>
          <Button type='primary' className='w-full' onClick={handleLogin}>Login</Button>
          <div className='login-divider mt-3 mb-3'>
            <div className='login-divider-line'/>
            <div className='login-divider-text'>OR</div>
            <div className='login-divider-line'/>
          </div>
          <div id="buttonDiv" className='d-flex justify-content-start' ></div>

          {/* <div className='d-flex justify-content-start'>
            <GoogleLogin 
            onSuccess={(res)=>{handleGoogleLoginSuccess(res)}}
            onError={(err)=>{handleGoogleLoginFailure(err)}}
            />
          </div> */}
          <div className="hover:text-blue-300	cursor-pointer text-blue-600 mt-3">
            <a style={{textDecoration:"none"}}>Don't Have An Account?</a>
          </div>
        </div>
      </form>
    </div>
  );
}
// const mapStateToProps = (state) => ({
//   loginUser: state.user,
// });

// const mapDispatchToProps = {
//   Login,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default (Login);