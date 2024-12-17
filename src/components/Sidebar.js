// import React from 'react';
// import { Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
// import { Link } from 'react-router-dom';

// const Sidebar = () => {
//   return (
//     <Drawer
//     sx={{
//         '& .MuiDrawer-paper': {
//           width: '100%',
//           boxSizing: 'border-box',
//           position: 'relative',
//         },
//       }}
     
//       variant="permanent"
//       anchor="left"
//     >
//       <List>
//         <ListItem>
//           <Button
//             component={Link}
//             to="/"
//             fullWidth
//             variant="contained"
//             color="primary"
//           >
//             Dashboard
//           </Button>
//         </ListItem>
//         <ListItem>
//           <Button
//             component={Link}
//             to="/Tracking"
//             fullWidth
//             variant="contained"
//             color="primary"
//           >
//             Device Tracking
//           </Button>
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;

import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const Sidebar = ({open,setOpen}) => {

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: open ? 180 : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 180 : 60,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          position: "relative",
          backgroundColor: "#FF9F40",


        },
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            sx={{ justifyContent: open ? 'initial' : 'center', '&:hover': { backgroundColor: '#FFD580' } }}
          > 
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                <DashboardIcon />
              </ListItemIcon>
            {open && <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />}
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/Tracking"
            sx={{ justifyContent: open ? 'initial' : 'center', '&:hover': { backgroundColor: '#FFD580' } }}
          > 
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                <TrackChangesIcon />
              </ListItemIcon>
            {open && <ListItemText primary="Device Tracking" sx={{ opacity: open ? 1 : 0 }} />}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;

