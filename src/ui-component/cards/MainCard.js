import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Link, useNavigate } from 'react-router-dom';
import { prototype } from 'apexcharts';
import { color } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

// constant
const headerSX = {
  padding: 2,
  '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = React.forwardRef(
  (
    {
      headerColor = false,
      color,
      circle = false,
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      backButton,
      goBackLink,
      settingsIcon = false,
      handleOpenDialog,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const circleItem = (item) => {
      return (
        <div>
          <div style={{ width: 10, height: 10, backgroundColor: item?.couleur, borderRadius: 9999 }} />
        </div>
      );
    };
    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          border: border ? '1px solid' : 'none',
          borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary[200] + 75,
          // ':hover': {
          //   boxShadow: boxShadow
          //     ? shadow || (theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 14px 0 rgb(32 40 45 / 8%)')
          //     : 'inherit'
          // },
          ...sx
        }}
      >
        {/* card header and action */}
        {!darkTitle && settingsIcon && (
          <CardHeader
            style={{ backgroundColor: headerColor && `${color}` }}
            sx={headerSX}
            // title={
            //   <div style={{ display: 'flex', gap: 4, alignItems: 'center', color: headerColor && `white` }}>
            //     {backButton && (
            //       <IconButton
            //         color="secondary"
            //         size="large"
            //         onClick={(e) => {
            //           if (goBackLink) {
            //             navigate(goBackLink);
            //           } else navigate(-1);

            //           // handleOpenEditDialog(e);
            //         }}
            //         style={{
            //           padding: '5px'
            //         }}
            //       >
            //         {/* <Link to={goBackLink}> */}
            //         <ArrowBackIosNewRoundedIcon sx={{ fontSize: '1rem' }} />
            //         {/* </Link> */}
            //       </IconButton>
            //     )}
            //     {title}
            //     <div style={{ marginLeft: '1rem' }}>{circle && circleItem({ couleur: circle })}</div>
            //   </div>
            // }
            action={
              <IconButton aria-label="settings" onClick={handleOpenDialog} color={theme.palette.secondary.main}>
                <EditIcon />
              </IconButton>
            }
            // action={secondary}
          />
        )}
        {!darkTitle && title && (
          <CardHeader
            style={{ backgroundColor: headerColor && `#13597e` }}
            sx={headerSX}
            title={
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', color: headerColor ? `white` : `#13597e` }}>
                {backButton && (
                  <IconButton
                    color="white"
                    size="large"
                    onClick={(e) => {
                      if (goBackLink) {
                        navigate(goBackLink);
                      } else navigate(-1);

                      // handleOpenEditDialog(e);
                    }}
                    style={{
                      padding: '5px'
                    }}
                  >
                    {/* <Link to={goBackLink}> */}
                    <ArrowBackIosNewRoundedIcon sx={{ fontSize: '1rem' }} />
                    {/* </Link> */}
                  </IconButton>
                )}
                {title}
                <div style={{ marginLeft: '1rem' }}>{circle && circleItem({ couleur: circle })}</div>
              </div>
            }
            action={secondary}
            // action={secondary}
          />
        )}

        {darkTitle && title && (
          <CardHeader
            sx={headerSX}
            title={
              <>
                <Typography variant="h3">{title}</Typography>
              </>
            }
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  circle: PropTypes.func
};

export default MainCard;
