import React from 'react';
import { Input } from 'semantic-ui-react';
import styled from 'styled-components';
import { withFormik } from 'formik';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const SendMessage = ({
  placeholder,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <SendMessageWrapper>
    <Input
      name="message"
      value={values.message}
      onBlur={handleBlur}
      onChange={handleChange}
      fluid
      placeholder={`Отправить #${placeholder}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !isSubmitting) {
          handleSubmit(e);
        }
      }}
    />
  </SendMessageWrapper>
);

export default withFormik({
  mapPropsToValues: () => ({ message: '' }),
  handleSubmit: async (values, { props: { onSubmit }, setSubmitting, resetForm }) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }
    await onSubmit(values.message);
    resetForm(false);
  },
})(SendMessage);
