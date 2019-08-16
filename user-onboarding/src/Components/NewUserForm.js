import React, { useState, useEffect } from 'react';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { animationFrameScheduler } from 'rxjs';

const UserForm = ({ errors, touched, values, status }) => {

    const [ users, setUsers ] = useState([]);
    
    useEffect(() => {
        if(status) {
            setUsers([...users, status])
        }
    }, [status])

    return (
        <div className='user-form'>
            <Form className='form'>
                <Field 
                    component='input'
                    type='text'
                    name='name'
                    placeholder='Name'
                />
                
                {touched.name && errors.name && (
                    <p className='error'>{errors.name}</p>
                )}

                <Field 
                    component='input'
                    type='text'
                    name='email'
                    placeholder='Email'
                />

                {touched.email && errors.email && (
                    <p className='error'>{errors.email}</p>
                )}

                <Field 
                    component='input'
                    type='password'
                    name='password'
                    placeholder='Password'
                />

                {touched.password && errors.password && (
                    <p className='error'>{errors.password}</p>
                )}

                <label className='checkbox-container'>
                    Terms of Service
                    <Field 
                        type='checkbox'
                        name='termsOfService'
                        checked={values.termsOfService}
                    />  
                </label>

                {touched.termsOfService && errors.termsOfService && (
                    <p className='error'>{errors.termsOfService}</p>
                )}
                

                <button type='submit'>Submit</button>

            </Form>
            <div>
                <h3>List of current users:</h3>
                {users.map(user => (
                <p key={user.id}>{user.name} {user.email}</p>
                ))}
            </div>
            
        </div>
    )
}

const newUserFormik = withFormik({
    mapPropsToValues({ name, email, password, termsOfService}) {
        return {
            name: name || '',
            email: email || '',
            password: password || '',
            termsOfService: termsOfService || false,

        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required('please enter your name'),
        email: Yup.string().email('must have a valid email').required('please enter your email address'),
        password: Yup.string().min(7).required('please enter your password'),
        termsOfService: Yup.boolean().oneOf([true], 'please read and accept the Terms of Service')
    }),
    handleSubmit(values, { setStatus, resetForm }) {
        console.log('inside handlesubmit', values)
        axios
            .post('https://reqres.in/api/users', values)
            .then(res => {
                console.log('inside axios then',res.data)
                setStatus(res.data)
                resetForm()
            })
            .catch(no => {
                console.log(no)
            })

    }
})

const NewUserForm = newUserFormik(UserForm)

export default NewUserForm