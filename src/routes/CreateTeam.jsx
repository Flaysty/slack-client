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

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);
    extendObservable(this, {
      name: '',
      errors: {},
    });
  }

  onSubmit = async () => {
    const { name } = this;
    const { mutate, history } = this.props;
    let response = null;
    try {
      response = await mutate({
        variables: { name },
      });
    } catch (e) {
      history.push('/login');
    }

    const { ok, errors, team } = response.data.createTeam;

    if (ok) {
      this.props.history.push(`/view-team/${team.id}`);
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      this.errors = err;
    }
  }

  onChange = ({ target: { name, value } }) => {
    this[name] = value;
  };

  render() {
    const { name, errors: { nameError } } = this;
    const errorList = [];
    if (nameError) {
      errorList.push(nameError);
    }
    return (
      <Container text>
        <Header as="h2">Создание канала</Header>
        {errorList.length > 0 ? (
          <Message
            error
            header="Ошибка создания канала"
            list={errorList}
          />
        ) : null}
        <Form>
          <Form.Field error={!!nameError}>
            <Input name="name" onChange={this.onChange} value={name} placeholder="Название канала" fluid />
          </Form.Field>
          <Button onClick={this.onSubmit}>Создать</Button>
        </Form>
      </Container>
    );
  }
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));
