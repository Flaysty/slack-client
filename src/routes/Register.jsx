import React from 'react';
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

class Register extends React.Component {
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  onChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  }

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });
    const { mutate, history } = this.props;
    const { username, email, password } = this.state;
    const response = await mutate({
      variables: { username, email, password },
    });
    const { ok, errors } = response.data.register;
    if (ok) {
      history.push('/login');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.setState(err);
    }
  }

  render() {
    const {
      username,
      email,
      password,
      usernameError,
      emailError,
      passwordError,
    } = this.state;
    const errorList = [];
    if (usernameError) {
      errorList.push(usernameError);
    }
    if (emailError) {
      errorList.push(emailError);
    }
    if (passwordError) {
      errorList.push(passwordError);
    }
    return (
      <Container text>
        <Header as="h2">Регистрация</Header>
        {errorList.length > 0 ? (
          <Message
            error
            header="Ошибки заполнения формы регистрации"
            list={errorList}
          />
        ) : null}
        <Form>
          <Form.Field error={!!usernameError}>
            <Input name="username" onChange={this.onChange} value={username} placeholder="Логин" fluid />
          </Form.Field>
          <Form.Field error={!!emailError}>
            <Input name="email" onChange={this.onChange} value={email} placeholder="Email" fluid />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input name="password" onChange={this.onChange} value={password} type="password" placeholder="Пароль" fluid />
          </Form.Field>
          <Button onClick={this.onSubmit}>Зарегистрироваться</Button>
        </Form>
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(registerMutation)(Register);
