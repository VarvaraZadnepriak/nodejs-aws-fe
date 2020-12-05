import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import axios from 'axios';
import mimeTypes from 'mime-types';

const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

export default function CSVFileImport({url, title}: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();

  const onFileChange = (e: any) => {
    console.log(e);
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    setFile(files.item(0));
  };

  const removeFile = () => {
    setFile('');
  };

  const uploadFile = async (e: any) => {
      // Define correct content-type - Windows compatible
      const contentType = mimeTypes.lookup(file.name);

      if (contentType !== 'text/csv') {
        alert('Неверный тип файла. Пожалуйста, выберите *.csv файл!');
        return;
      }

      const authorizationToken = localStorage.getItem('authorization_token');

      // Get the presigned URL
      const response = await axios({
        method: 'GET',
        url,
        params: {
          name: encodeURIComponent(file.name)
        },
        ...(authorizationToken && {
          headers: {
            Authorization: `Basic ${authorizationToken}`,
          },
        })
      });
      console.log('File to upload: ', file.name)

      console.log('Uploading to: ', response.data)
      const result = await fetch(response.data, {
        method: 'PUT',
        body: file,
        ...(contentType && {
          headers: {
            'Content-Type': contentType
          }
        })
      })
      console.log('Result: ', result)
      setFile('');
    }
  ;

  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
          <input type="file" onChange={onFileChange}/>
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </div>
  );
}
