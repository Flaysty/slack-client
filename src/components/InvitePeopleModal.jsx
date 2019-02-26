import React from 'react';
import { Form, Input, Button, Modal, Message } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import normalizeErrors from '../normalizeErrors';

const InvitePeopleModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  touched,
  errors,
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Пригласить друзей в канал</Modal.Header>
    <Modal.Content>
      {touched.email && errors.email ? (
        <Message
          error
          header="Ошибка"
          list={errors.email}
        />
      ) : null}
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
            fluid
            placeholder="Email пользователя"
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Button disabled={isSubmitting} fluid onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit} fluid>
            Пригласить
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(addTeamMemberMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting, setErrors },
    ) => {
      const response = await mutate({
        variables: { teamId, email: values.email },
      });
      const { ok, errors } = response.data.addTeamMember;
      if (ok) {
        onClose();
        setSubmitting(false);
      } else {
        setSubmitting(false);
        const errorsLength = errors.length;
        const filteredErrors = errors.filter(e => e.message !== 'user_id must be unique');
        if (errorsLength !== filteredErrors.length) {
          filteredErrors.push({
            path: 'email',
            message: 'Этот пользователь уже является участником',
          });
        }
        setErrors(normalizeErrors(filteredErrors));
      }
    },
  }),
)(InvitePeopleModal);
