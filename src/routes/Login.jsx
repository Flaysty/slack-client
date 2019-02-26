import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Form,
  Button,
  Input,
  Container,
  Header,
  Message,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { wsLink } from '../apollo';

class Login extends React.Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
    });
  }

  onSubmit = async () => {
    const { email, password } = this;
    const { mutate, history } = this.props;
    const response = await mutate({
      variables: { email, password },
    });
    const {
      ok,
      token,
      refreshToken,
      errors,
    } = response.data.login;
    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      wsLink.subscriptionClient.tryReconnect();
      history.push('/view-team');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.errors = { ...err };
    }
  }

  onChange = ({ target: { name, value } }) => {
    this[name] = value;
  };

  render() {
    const { email, password, errors: { emailError, passwordError } } = this;
    const errorList = [];
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }
    return (
      <Container text>
        <Header as="h2">Авторизация</Header>
        {errorList.length > 0 ? (
          <Message
            error
            header="Ошибки заполнения формы авторизации"
            list={errorList}
          />
        ) : null}
        <Form>
          <Form.Field error={!!emailError}>
            <Input name="email" onChange={this.onChange} value={email} placeholder="Email" fluid />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input name="password" onChange={this.onChange} value={password} type="password" placeholder="Пароль" fluid />
          </Form.Field>
          <Button onClick={this.onSubmit}>Войти</Button>
        </Form>
      </Container>
    );
  }
}

const LoginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password:$password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(LoginMutation)(observer(Login));
