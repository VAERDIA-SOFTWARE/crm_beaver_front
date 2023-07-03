import DeleteIcon from '@mui/icons-material/Delete';
import { Box, FormHelperText, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef, useCallback, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import uploadImg from '../assets/cloud-upload.png';
import { ImageConfig } from './FileConfig';

// 👇 Custom Styles for the Box Component
const CustomBox = styled(Box)(({ isInputDisabled }) => ({
  '&.MuiBox-root': {
    // backgroundColor: '#fff',
    borderRadius: '2rem',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 8px',
    // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
    padding: '1rem',
    opacity: isInputDisabled ? 0.5 : 1,
    cursor: isInputDisabled ? 'not-allowed !important' : 'pointer'
  },
  '&.MuiBox-root:hover, &.MuiBox-root.dragover': {
    opacity: 0.6
  }
}));

// 👇 FileUpload Component
const CustomFileUpload = ({ limit, multiple, name, handleFilesChange, onFileDelete, fileTypes = [] }, fileRef) => {
  // 👇 Form Context
  const {
    control,
    formState: { isSubmitting, errors }
  } = useFormContext();

  // 👇 State with useState()
  const { field } = useController({ name, control });
  const [singleFile, setSingleFile] = useState([]);
  const [fileList, setFileList] = useState([]);
  const wrapperRef = useRef(null);

  const isInputDisabled = !!(Array.isArray(singleFile) && singleFile?.length);

  // 👇 Toggle the dragover class
  const onDragEnter = () => wrapperRef.current?.classList.add('dragover');
  const onDragLeave = () => wrapperRef.current?.classList.remove('dragover');

  // 👇 Image Upload Service
  const onFileDrop = useCallback(
    (e) => {
      const target = e.target;
      if (!target.files) {
        return;
      }

      if (limit === 1) {
        console.log(target.files);
        const newFile = Object.values(target.files).map((file) => file);
        if (singleFile.length >= 1) return toast.warning('Un seul fichier est autorisé');
        setSingleFile(newFile);
        field.onChange(newFile[0]);
        handleFilesChange(target.files);
      }

      if (multiple) {
        const newFiles = Object.values(target.files).map((file) => file);
        if (newFiles) {
          const updatedList = [...fileList, ...newFiles];
          if (updatedList.length > limit || newFiles.length > 3) {
            return alert(`Image must not be more than ${limit}`);
          }
          setFileList(updatedList);
          field.onChange(updatedList);
        }
      }
    },
    [field, fileList, handleFilesChange, limit, multiple, singleFile.length]
  );

  // 👇 remove multiple images
  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    onFileDelete();
    handleFilesChange([]);
  };

  // 👇 remove single image
  const fileSingleRemove = () => {
    setSingleFile([]);
    onFileDelete();
    handleFilesChange([]);
  };

  // 👇 TypeScript Type
  // type CustomType = 'jpg' | 'png' | 'svg';

  // 👇 Calculate Size in KiloByte and MegaByte
  const calcSize = (size) => {
    return size < 1000000 ? `${Math.floor(size / 1000)} KB` : `${Math.floor(size / 1000000)} MB`;
  };

  // 👇 Reset the State
  // useEffect(() => {
  //   if (isSubmitting) {
  //     setFileList([]);
  //     setSingleFile([]);
  //   }
  // }, [isSubmitting]);

  // 👇 Actual JSX
  return (
    <>
      <CustomBox isInputDisabled={isInputDisabled}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: 'relative',
            width: '100%',
            height: '13rem',
            border: '2px dashed #4267b2',
            borderRadius: '20px'
          }}
          // ref={wrapperRef}
          // onDragEnter={onDragEnter}
          // onDragLeave={onDragLeave}
          // onDrop={onDragLeave}
        >
          <Stack justifyContent="center" sx={{ p: 1, textAlign: 'center' }}>
            <Typography sx={{ color: '#ccc' }}>{limit > 1 ? 'Importer des fichiers' : 'Importer un fichier'}</Typography>
            <div>
              <img src={uploadImg} alt="file upload" style={{ width: '5rem' }} />
            </div>
            <Typography variant="body1" component="span">
              <strong>Extensions de fichiers</strong>
            </Typography>
            <Typography variant="body2" component="span">
              {fileTypes?.map((e) => '.' + e?.toUpperCase() + ' ')}
            </Typography>
          </Stack>
          {/* <Controller
            name={name}
            defaultValue=""
            control={control}
            render={({ field: { name, onBlur, ref } }) => ( */}
          <input
            disabled={isInputDisabled}
            ref={fileRef}
            type="file"
            name={name}
            // onBlur={onBlur}
            // ref={ref}
            onChange={onFileDrop}
            multiple={multiple}
            accept={fileTypes?.map((e) => '.' + e)}
            style={{
              opacity: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: isInputDisabled ? 'not-allowed' : 'pointer'
            }}
          />
          {/* )}
          /> */}
        </Box>
      </CustomBox>

      <FormHelperText sx={{ textAlign: 'center', my: 1 }} error={!!errors[name]}>
        {errors[name] ? errors[name]?.message : ''}
      </FormHelperText>

      {/* 👇Image Preview 👇 */}
      {fileList.length > 0 || singleFile.length > 0 ? (
        <Stack spacing={2} sx={{ my: 2 }}>
          {(multiple ? fileList : singleFile).map((item, index) => {
            const imageType = item.type.split('/')[1];
            return (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  backgroundColor: '#f5f8ff',
                  borderRadius: 1.5,
                  p: 0.5
                }}
              >
                <Box display="flex">
                  <img
                    src={ImageConfig[`${imageType}`] || ImageConfig['default']}
                    alt="upload"
                    style={{
                      height: '2.5rem',
                      objectFit: 'contain'
                    }}
                  />
                  <Box sx={{ ml: 1 }}>
                    <Typography>{item.name}</Typography>
                    <Typography variant="body2">{calcSize(item.size)}</Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => {
                    if (multiple) {
                      fileRemove(item);
                    } else {
                      fileSingleRemove();
                    }
                  }}
                  sx={{
                    color: '#df2c0e',
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
        </Stack>
      ) : null}
    </>
  );
};

export default forwardRef(CustomFileUpload);
