import React, {useContext, useState} from "react";
import {Link} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {useMutation} from "@apollo/react-hooks";
import {REGISTER} from "../gql/mutation";

const Register = (props) => {
    const {login} = useContext(AuthContext);
    const [values,setValues] = useState({});
    const [errors,setErrors] = useState({});

    const [registerUser] = useMutation(REGISTER,{
            update(_,data){
                login(data.data.register);
                props.history.push("/");
            },
            onError(err){
                setErrors(err.graphQLErrors[0].extensions.errors);
            },
            variables:values,
        },
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        registerUser();
    }

    return (
        <main className="form-signin d-flex align-items-center justify-content-center" style={{width:"inherit",height:"inherit"}}>
            <form className="w-25" onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 fw-normal text-center">Sign in</h1>

                <div className="form-floating">
                    <input type="text" className="form-control" id="floatingInput" name="username" required autoFocus={true} value={values.username} onChange={(e)=> {setValues({...values,[e.target.name]: e.target.value})}} placeholder="Username"/>
                    <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" name="password" required value={values.password} onChange={(e) => {setValues({...values,[e.target.name]: e.target.value})}} placeholder="Password" />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="floatingPassword" name="confirmPassword" required value={values.confirmPassword} onChange={(e) => {setValues({...values,[e.target.name]: e.target.value})}} placeholder="Confirm Password" />
                    <label htmlFor="floatingPassword">Confirm Password</label>
                    <small className="text-danger">
                        {errors.password} <br /> {errors.username} <br /> {errors.confirmPassword}
                    </small>
                </div>

                <button className="mb-3 w-100 btn btn-primary" type="submit">Register</button>
            </form>
        </main>
    )
}

export default Register