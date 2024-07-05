import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import { Close, CloudUploadOutlined, AttachFileOutlined, DescriptionOutlined } from '@mui/icons-material';

interface UploadCsvModalProps {
  open: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => void;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: '#141b2d',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
  color: 'white',
};

const dashedBoxStyle = {
  border: '2px dashed white',
  borderRadius: '8px',
  padding: '40px',
  cursor: 'pointer', 
  display: 'flex',
  flexDirection: 'column' as 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const UploadCsvModal: React.FC<UploadCsvModalProps> = ({ open, onClose, onFileUpload }) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileIcon, setFileIcon] = useState<JSX.Element>(<CloudUploadOutlined sx={{ fontSize: '100px', color: 'white' }} />);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setFileIcon(<DescriptionOutlined sx={{ fontSize: '100px', color: 'white' }} />);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type === 'text/csv') { 
      setFile(file);  
      setFileIcon(<DescriptionOutlined sx={{ fontSize: '100px', color: 'white' }} />);
    }
  };

  const openFileDialog = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
        <Box
          sx={dashedBoxStyle}
          mb={2}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {fileIcon}
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {file ? (
              <Typography sx={{ mt: 2 }}>
                {file.name}
              </Typography>
            ) : (
              <Typography sx={{ mt: 2 }}>
                Arraste e solte seu arquivo aqui ou
                <Button
                  onClick={openFileDialog}
                  variant="text"
                  sx={{ color: 'white', ml: 1, border: '2px solid white', }}

                >
                  Escolha um arquivo
                </Button>
              </Typography>
            )}
          </Typography>
        </Box>
        <input
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Button
          variant="contained"
          onClick={() => file && onFileUpload(file)}
          sx={{
            backgroundColor: 'white',
            color: '#141b2d',
            fontWeight: 'bold',
          }}
        >
          Upload CSV
        </Button>
      </Box>
    </Modal>
  );
};

export default UploadCsvModal;