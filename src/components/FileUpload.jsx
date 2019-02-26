import React from 'react';
import Dropzone from 'react-dropzone';

const FileUpload = ({ children }) => (
  <Dropzone onDrop={() => console.log('file dropped')}>
    {({ getRootProps }) => <div {...getRootProps()} />}
    {children}
  </Dropzone>
);

export default FileUpload;
